import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Upload, ScanLine, X, LoaderCircle, CheckCircle2, CloudRain, Leaf, ArrowRight, RotateCcw, AlertTriangle, ImagePlus, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { crops, createDemoDiagnosis, useFarm, type FarmDetails, type Scenario, type Diagnosis } from '@/src/context/FarmContext';
import { supabase } from '../../supabase';

// ---- Supabase config for this page ----
const BUCKET_NAME = 'leaf images'; // matches your Storage bucket exactly (has a space)
const TABLE_NAME = 'diagnose'; // TODO: replace with your actual table name if different

const optionalSelects = [
  { key: 'stage', label: 'Growth stage', options: ['Seedling', 'Growing', 'Flowering', 'Fruiting', 'Harvest'] },
  { key: 'soil', label: 'Soil type', options: ['Sandy', 'Loamy', 'Clay', 'Other'] },
  { key: 'rain', label: 'Rain probability', options: ['Low', 'Medium', 'High'] },
] as const;
const numbers = [
  { key: 'ph', label: 'Soil pH', unit: 'pH', min: 0, max: 14, placeholder: 'e.g. 6.5' },
  { key: 'moisture', label: 'Soil moisture', unit: '%', min: 0, max: 100, placeholder: 'e.g. 31' },
  { key: 'temperature', label: 'Temperature', unit: '°C', min: -50, max: 60, placeholder: 'e.g. 29' },
] as const;

export function Diagnose({ onAdvisor }: { onAdvisor: () => void }) {
  const farm = useFarm();
  const { file, setFile, details, sources, updateDetail, scenario, setScenario } = farm;
  const [customFields, setCustomFields] = useState<Record<string, boolean>>(() => ({
    stage: !!details.stage && !optionalSelects[0].options.some(option => option === details.stage),
    soil: !!details.soil && (!optionalSelects[1].options.some(option => option === details.soil) || details.soil === 'Other'),
  }));
  const [preview, setPreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FarmDetails, string>>>({});
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [dragging, setDragging] = useState(false);
  const upload = useRef<HTMLInputElement>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultPanel = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (result || failure) {
      resultPanel.current?.focus({ preventScroll: true });
      resultPanel.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  }, [result, failure]);
  const resetResult = () => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(false); setResult(null); setFailure(false);
  };
  const change = (key: keyof FarmDetails, value: string) => {
    resetResult(); updateDetail(key, value); setErrors(prev => ({ ...prev, [key]: undefined }));
  };
  const selectFile = (next?: File) => {
    if (!next) return;
    resetResult();
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type)) {
      setImageError('Choose a JPEG, PNG or WebP image. Your previous image, if any, has been kept.'); return;
    }
    if (next.size > 10 * 1024 * 1024) { setImageError('Choose an image smaller than 10 MB.'); return; }
    setImageError(''); setFile(next);
  };
  const clearImage = () => { resetResult(); setFile(null); setImageError(''); upload.current?.focus(); };

  // ---- Supabase: upload the selected image to Storage, return its public URL ----
  const uploadImageToSupabase = async (imageFile: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Upload failed:', uploadError.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  // ---- Supabase: insert the diagnosis result as a row in the table ----
  const saveDiagnosisToTable = async (imageUrl: string, diagnosis: Diagnosis) => {
    const { error: insertError } = await supabase.from(TABLE_NAME).insert({
      img_url: imageUrl,

      confidence: diagnosis.confidence,
      crop: details.crop || null,
      stage: details.stage || null,
      soil_type: details.soil || null,
      ph: details.ph === '' ? null : Number(details.ph),
      moisture: details.moisture === '' ? null : Number(details.moisture),
      temperature: details.temperature === '' ? null : Number(details.temperature),
      rain_prob: details.rain || null,
      location: details.location || null,
    });

    if (insertError) {
      console.error('Insert into table failed:', insertError.message);
    }
  };

  const analyze = async (event?: FormEvent) => {
    event?.preventDefault();
    if (loading) return;
    const validation: Partial<Record<keyof FarmDetails, string>> = {};
    for (const field of numbers) {
      const value = details[field.key];
      if (form.current?.querySelector<HTMLInputElement>(`#${field.key}`)?.validity.badInput || value !== '' && (!Number.isFinite(Number(value)) || Number(value) < field.min || Number(value) > field.max)) {
        validation[field.key] = `Enter a value from ${field.min} to ${field.max}.`;
      }
    }
    setErrors(validation);
    if (Object.keys(validation).length) {
      const section = form.current?.querySelector('details');
      if (section) section.open = true;
      requestAnimationFrame(() => form.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    if (!file) { setImageError('Add a leaf photo to continue.'); upload.current?.focus(); return; }
    setImageError(''); setResult(null); setFailure(false); setLoading(true);

    const imageUrl = await uploadImageToSupabase(file);
    if (!imageUrl) {
      setLoading(false);
      setFailure(true);
      return;
    }

    timer.current = setTimeout(async () => {
      if (scenario === 'error') { setLoading(false); setFailure(true); return; }
      const next = createDemoDiagnosis(scenario, details, sources);
      setLoading(false);
      setResult(next); farm.setLatest(next);
      await saveDiagnosisToTable(imageUrl, next);
    }, 1000);
  };

  return <div className="diagnosis-page space-y-7 pb-6">
    <header className="diagnosis-heading flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="eyebrow">CROP HEALTH</span>
        <h1 className="page-title">Diagnose your crop</h1>
        <p className="page-subtitle">One leaf photo. Clear next steps.</p>
      </div>
      <span className="demo-badge">
        <ScanLine size={15} className="mr-2" />Preview</span>
    </header>
    <ol className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="Diagnosis steps">
      {['Upload photo', 'Crop details', 'View report'].map((label, i) => <li key={label} className={`step-card ${i === 2 && result ? 'bg-primary/10' : ''}`}>
        <span className="step-number">{i + 1}</span>
        <span>{label}</span>
      </li>)}
    </ol>
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
      <form ref={form} onSubmit={analyze} noValidate className="space-y-5">
        <section className="panel space-y-5">
          <div className="section-heading">
            <span className="icon-tile">
              <ImagePlus size={22} />
            </span>
            <div>
              <h2>Leaf photo</h2>
              <p>Required · JPEG, PNG or WebP · Up to 10 MB</p>
            </div>
          </div>
          <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); if (!loading) selectFile(e.dataTransfer.files[0]); }} className={`upload-zone ${dragging ? 'border-primary bg-primary/10' : ''}`}>
            {preview ? <img src={preview} alt="Selected crop image" className="w-full h-56 object-contain rounded-xl" onError={() => { setFile(null); resetResult(); setImageError('This image could not be opened. Choose another JPEG, PNG or WebP photo.'); }} /> : <div className="flex flex-col items-center justify-center min-h-48 gap-3">
              <span className="p-4 bg-primary/10 text-primary rounded-2xl">
                <Leaf size={34} />
              </span>
              <p className="font-bold text-lg">Add a leaf photo</p>
              <p className="text-sm text-on-surface-variant">Drop a photo here, or import one below.</p>
            </div>}
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button type="button" disabled={loading} onClick={() => upload.current?.click()} className="secondary-button">
              <Upload size={18} />{file ? 'Change photo' : 'Import image'}</button>
          </div>
          <input ref={upload} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload crop image" className="sr-only" disabled={loading} onChange={e => { selectFile(e.target.files?.[0]); e.target.value = ''; }} />
          {file && <div className="flex justify-between gap-3 text-sm">
            <span className="truncate text-on-surface-variant">{file.name}</span>
            <button type="button" disabled={loading} onClick={clearImage} className="text-primary font-semibold inline-flex items-center gap-1">
              <X size={16} />Remove</button>
          </div>}
          {imageError && <p role="alert" className="error-message">{imageError}</p>}
          <p className="text-xs leading-relaxed text-on-surface-variant">For best results, use a clear photo of one leaf in natural light.</p>
        </section>
        <section className="panel space-y-5">
          <div className="section-heading">
            <span className="icon-tile">
              <Leaf size={22} />
            </span>
            <div>
              <h2>Crop details</h2>
              <p>Add a little context about your crop.</p>
            </div>
          </div>
          <label className="field-label" htmlFor="crop">Crop </label>
          <input id="crop" list="demo-crops" value={details.crop} onChange={e => change('crop', e.target.value)} className="form-control" disabled={loading} maxLength={80} placeholder="Choose or enter a crop" />
          <datalist id="demo-crops">{crops.map(crop => <option key={crop} value={crop} />)}</datalist>

          <details open className="context-details">
            <summary className="flex items-center justify-between font-bold cursor-pointer py-3">Farm details <span className="text-xs font-normal text-on-surface-variant">Optional <ChevronDown size={14} className="inline" />
            </span>
            </summary>
            <p className="text-sm text-on-surface-variant mb-4">Fill in what you know; leave the rest blank.</p>
            <div className="flex flex-wrap gap-3 mb-5">
              <button type="button" disabled={loading} className="text-primary text-sm font-bold underline underline-offset-4" onClick={() => { resetResult(); setErrors({}); setCustomFields({}); farm.useSamples(); }}>Use sample values</button>
              <button type="button" disabled={loading} className="text-sm text-on-surface-variant underline underline-offset-4" onClick={() => { resetResult(); setErrors({}); setCustomFields({}); farm.clearContext(); }}>Clear details</button>
            </div>
            <fieldset disabled={loading} className="grid sm:grid-cols-2 gap-5">
              <legend className="sr-only">Optional farm details</legend>
              {optionalSelects.map(field => <div key={field.key}>
                <label className="field-label" htmlFor={field.key}>{field.label}</label>
                <select id={field.key} className="form-control" value={customFields[field.key] ? 'custom' : details[field.key]} onChange={e => { const custom = e.target.value === 'custom'; setCustomFields(prev => ({ ...prev, [field.key]: custom })); change(field.key, custom ? '' : e.target.value); }}>
                  <option value="">Unknown</option>{field.options.filter(option => option !== 'Other').map(option => <option key={option}>{option}</option>)}{field.key !== 'rain' && <option value="custom">Other — write your own</option>}</select>
                {customFields[field.key] && <label className="block mt-3"><span className="field-label">Your {field.label.toLowerCase()}</span><input className="form-control" maxLength={120} value={details[field.key]} onChange={e => change(field.key, e.target.value)} placeholder={field.key === 'soil' ? 'e.g. Sandy loam' : 'e.g. Early flowering, week 6'} /></label>}
              </div>)}
              {numbers.map(field => <div key={field.key}>
                <label className="field-label" htmlFor={field.key}>{field.label}</label>
                <div className="relative">
                  <input id={field.key} type="number" step="any" min={field.min} max={field.max} placeholder={field.placeholder} value={details[field.key]} onChange={e => change(field.key, e.target.value)} aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined} className="form-control pr-12" />
                  <span className="absolute right-3 top-3.5 text-sm text-on-surface-variant pointer-events-none">{field.unit}</span>
                </div>
                {errors[field.key] && <p id={`${field.key}-error`} className="text-error text-xs mt-2">{errors[field.key]}</p>}
              </div>)}
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="location">Farm location</label>
                <input id="location" className="form-control" placeholder="Village or city, state" maxLength={120} value={details.location} onChange={e => change('location', e.target.value)} />
              </div>
            </fieldset>

          </details>
        </section>

        <button type="submit" disabled={!file || loading} className="primary-button w-full justify-center min-h-14">{loading ? <LoaderCircle size={20} className="animate-spin" /> : <ScanLine size={20} />}{loading ? 'Preparing report…' : 'Analyse leaf'}</button>

        <details className="preview-options space-y-3"><summary>Preview options</summary>
          <label htmlFor="scenario" className="field-label">Sample outcome
          </label>
          <select id="scenario" disabled={loading} className="form-control" value={scenario} onChange={e => { resetResult(); setScenario(e.target.value as Scenario); }}>
            <option value="disease">Disease detected</option>
            <option value="healthy">Healthy crop</option>
            <option value="uncertain">Uncertain / retake photo</option>
            <option value="error">Service error / retry</option>
          </select>
          <p className="text-xs text-on-surface-variant">Choose an outcome to test this preview.</p>
        </details>
      </form>
      <div ref={resultPanel} tabIndex={-1} className="lg:sticky lg:top-28 scroll-mt-28 rounded-3xl space-y-5" aria-label="Diagnosis result" aria-live="polite" aria-busy={loading}>
        <section className="panel space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your crop report</h2>
            <span className="demo-badge">Sample report</span>
          </div>
          {loading ? <div className="py-16 text-center">
            <LoaderCircle size={40} className="text-primary mx-auto animate-spin mb-5" />
            <h3 className="font-bold text-xl">Preparing your report</h3>

          </div> : failure ? <div className="space-y-4">
            <AlertTriangle className="text-error" size={36} />
            <h3 className="text-xl font-bold">Could not complete analysis</h3>
            <p className="text-sm text-on-surface-variant">Your photo and details are saved. Choose another outcome in Preview options to continue.</p>
            <button type="button" onClick={() => analyze()} className="secondary-button">
              <RotateCcw size={18} />Retry analysis</button>
          </div> : result ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className={`rounded-2xl p-5 ${result.status === 'Disease detected' ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2">{result.status}</p>
              <h3 className="text-2xl font-extrabold">{result.title}</h3>
              <p className="text-sm mt-3">{result.confidence === null ? 'A clearer photo is needed.' : <>Sample confidence <strong>{result.confidence}%</strong>
              </>}</p>
            </div>
            <p className="text-xs text-on-surface-variant">Sample result for preview; your photo has not been analysed.</p>
            <div>
              <h3 className="font-bold mb-4">{result.status === 'Uncertain result' ? 'Get a clearer photo' : 'Recommended next steps'}</h3>
              <ul className="space-y-3">{result.actions.map(action => <li key={action} className="flex gap-3 text-sm leading-relaxed">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />{action}</li>)}</ul>
            </div>
            <button type="button" className="primary-button w-full justify-center" onClick={() => { farm.setAdvisorQuestion(`My plant is ${result.details.crop || 'an unspecified crop'}. The sample report shows: ${result.title}. What should I do next?`); onAdvisor(); }}>Ask Farmi about this result<ArrowRight size={18} />
            </button>
            <button type="button" className="secondary-button w-full" onClick={clearImage}>
              <ImagePlus size={18} />Analyse another image</button>
          </motion.div> : <div className="py-12 text-center">
            <span className="inline-flex p-6 rounded-full bg-primary/5 text-primary mb-5">
              <ScanLine size={46} strokeWidth={1.5} />
            </span>
            <h3 className="text-xl font-bold">Your report will appear here</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mt-3">Import a leaf photo, add your crop details, and tap Analyse leaf.</p>
          </div>}
        </section>
        <section className="rounded-3xl bg-tertiary/10 border border-tertiary/15 p-6 space-y-3">
          <div className="flex gap-2 items-center text-tertiary">
            <CloudRain size={21} />
            <h2 className="font-bold">Water & weather</h2>
          </div>

          <p className="text-sm leading-relaxed text-on-surface-variant">{details.rain === 'High' ? 'Rain is likely. Check your local forecast before watering.' : 'Add moisture and rain details for more useful watering advice.'}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-on-surface-variant">Soil moisture</p>
              <p className="font-bold mt-1">{details.moisture === '' ? 'Unknown' : `${details.moisture}%`}</p>

            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Rain probability</p>
              <p className="font-bold mt-1">{details.rain || 'Unknown'}</p>

            </div>
          </div>

        </section>
      </div>
    </div>
  </div>;
}
