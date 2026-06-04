import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  Download,
  FileText,
  PlayCircle,
  Save,
  Loader2,
} from 'lucide-react';
import {
  jornadaService,
  type JornadaFieldConfig,
  type JornadaModuleContent,
  type JornadaStep,
  type ModuleActivity,
} from '../../services/jornadaService';

interface ModuloPageProps {
  moduleId: number;
  onBack: () => void;
  onOpenModule?: (moduleId: number) => void;
}

interface ModuleContentFallback {
  id: number;
  sector: string;
  title: string;
  subtitle: string;
  videoTitle: string;
  videoUrl?: string | null;
  pdfTitle: string;
  pdfUrl?: string | null;
  progress?: number;
}

const moduleContent: ModuleContentFallback[] = [
  {
    id: 1,
    sector: 'Empreendedorismo e pequenos negócios de alimentos',
    title: 'Sobre a empresa: missão, visão e valores',
    subtitle: 'Defina o que a empresa faz, onde quer chegar e quais princípios orientam atendimento, produção, qualidade e relação com clientes.',
    videoTitle: 'O que são a Visão, Missão e os Valores de uma empresa - Sebrae Talks',
    videoUrl: 'https://www.youtube.com/embed/EfKT92XtJlA',
    pdfTitle: 'Ferramenta Sebrae: Missão, Visão e Valores',
    pdfUrl: 'https://www.sebrae.com.br/Sebrae/Portal%20Sebrae/Anexos/ME_Missao-Visao-Valores.PDF',
  },
  {
    id: 2,
    sector: 'Mercado local, alimentos e comportamento do consumidor',
    title: 'Análise de mercado',
    subtitle: 'Mapeie quem compra, onde compra, por que compra e quais alternativas existem no entorno ou no digital.',
    videoTitle: 'Como analisar a concorrência em 5 passos simples - Sebrae PR',
    videoUrl: 'https://www.youtube.com/embed/lvMnb6lO42k',
    pdfTitle: 'Sebrae: Como elaborar uma pesquisa de mercado',
    pdfUrl: 'https://www.sebrae.com.br/Sebrae/Portal%20Sebrae/UFs/MG/Sebrae%20de%20A%20a%20Z/Como%2BElaborar%2Buma%2BPesquisa%2Bde%2BMercado.pdf',
  },
  {
    id: 3,
    sector: 'Canvas, proposta de valor e validação',
    title: 'Modelo de negócio',
    subtitle: 'Transforme a ideia em uma estrutura de funcionamento, com blocos visuais e um plano 5W2H para testar o próximo passo.',
    videoTitle: 'Sebrae Canvas: crie o seu modelo de negócios',
    videoUrl: 'https://www.youtube.com/embed/fkxRC0_x48E',
    pdfTitle: 'Sebrae: Canvas - Modelo de Negócios',
    pdfUrl: 'https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/e0660b16874d7be9b1628ea138e4cc1c/%24File/30595.pdf',
  },
  {
    id: 4,
    sector: 'Letramento digital aplicado a alimentos',
    title: 'Letramento digital e perspectivas para seu negócio',
    subtitle: 'Escolha usos digitais simples e coerentes com o perfil do cliente: divulgação, pedidos, fotos, cardápio, avaliações, delivery e relacionamento.',
    videoTitle: 'Transformação Digital Para Pequenos Negócios - Connect Sebrae',
    videoUrl: 'https://www.youtube.com/embed/MJ2fWDLBtjU',
    pdfTitle: 'Sebrae PR: passo a passo para um delivery de sucesso',
    pdfUrl: 'https://api.pr.sebrae.com.br/storage/comunidade/anexos/13880/PUB_%20Fast%20Track%20de%20Intelig%C3%AAncia%20-%20Passo%20a%20Passo%20para%20um%20Delivery%20de%20Sucesso%20-%2018052023.pdf',
  },
  {
    id: 5,
    sector: 'Ferramentas de gestão para pequenos negócios',
    title: 'Ferramentas digitais para administração e comunicação',
    subtitle: 'Estruture controles mínimos para administrar uma pequena empresa de alimentos sem complicar: Excel/Sheets, estoque, vendas, clientes e comunicação.',
    videoTitle: 'Controle de estoque: aprenda a controlar seu estoque de maneira simples - Sebrae PR',
    videoUrl: 'https://www.youtube.com/embed/5Anr9ipqzbc',
    pdfTitle: 'Sebrae: ideia de negócio Churrasquinho - gestão, planilhas e automação',
    pdfUrl: 'https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/IDEIAS_DE_NEGOCIO/PDFS/ideia-de-negocio_churrasquinho.pdf',
  },
];
const fallbackSteps: JornadaStep[] = [
  { key: 'video', label: 'Vídeo', description: 'Assista à explicação inicial', contentType: 'video', position: 1, completed: false },
  { key: 'avaliacao1', label: 'Atividade 1', description: 'Produza sua primeira resposta', contentType: 'activity', position: 2, completed: false },
  { key: 'pdf', label: 'PDF', description: 'Consulte o material de apoio', contentType: 'pdf', position: 3, completed: false },
  { key: 'avaliacao2', label: 'Atividade 2', description: 'Revise e finalize o módulo', contentType: 'activity', position: 4, completed: false },
];

const defaultFields: JornadaFieldConfig[] = [
  { key: 'resposta', label: 'Resposta', placeholder: 'Registre sua resposta aqui.' },
];

const defaultChecklist = [
  'A resposta está clara?',
  'A resposta está conectada ao negócio?',
  'A resposta apresenta uma decisão ou hipótese prática?',
  'O texto está simples e direto?',
];

interface ActivityFormProps {
  step: JornadaStep;
  values: Record<string, string>;
  checks: Record<string, boolean>;
  submitted?: boolean;
  onChangeValue: (field: string, value: string) => void;
  onToggleCheck: (item: string) => void;
  onSaveDraft: () => void;
}

function ActivityForm({
  step,
  values,
  checks,
  submitted = false,
  onChangeValue,
  onToggleCheck,
  onSaveDraft,
}: ActivityFormProps) {
  const fields = step.content?.fields?.length ? step.content.fields : defaultFields;
  const checklist = step.content?.checklist?.length ? step.content.checklist : defaultChecklist;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--graphite)]">{step.content?.title ?? step.label}</h2>
          <p className="text-[var(--graphite)]/70 mt-1">{step.content?.description ?? step.description}</p>
          {submitted && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm border border-green-200">
              <CheckCircle className="w-4 h-4" /> Atividade enviada
            </div>
          )}
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-[var(--graphite)] mb-2">{field.label}</label>
              <textarea
                value={values[field.key] ?? ''}
                onChange={(event) => onChangeValue(field.key, event.target.value)}
                placeholder={field.placeholder ?? 'Digite sua resposta.'}
                className="w-full min-h-24 p-4 rounded-2xl bg-[var(--skin-tone-light)]/50 dark:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/40 text-[var(--graphite)] outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/40"
              />
            </div>
          ))}
        </div>
      </div>

      <aside className="bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm p-6 h-fit">
        <h3 className="font-bold text-[var(--graphite)] mb-2">Checklist da atividade</h3>
        <p className="text-sm text-[var(--graphite)]/60 mb-4">Marque os critérios que sua resposta já atende.</p>

        <div className="space-y-3">
          {checklist.map((item) => (
            <label key={item} className="flex gap-3 items-start p-3 rounded-xl hover:bg-[var(--skin-tone-light)]/60 dark:hover:bg-[var(--skin-tone)] transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={!!checks[item]}
                onChange={() => onToggleCheck(item)}
                className="mt-1 h-4 w-4 accent-[var(--coral-neon)]"
              />
              <span className="text-sm text-[var(--graphite)]/80">{item}</span>
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={onSaveDraft}
          className="mt-6 w-full py-3 rounded-2xl bg-[var(--coral-neon)] text-white font-semibold shadow-md hover:bg-[var(--coral-neon-dark)] transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Salvar rascunho
        </button>
      </aside>
    </div>
  );
}

function VideoStep({ content, step }: { content: ModuleContentFallback | JornadaModuleContent; step: JornadaStep }) {
  const hasVideo = !!content.videoUrl && !content.videoUrl.includes('VIDEO_MODULO');
  const objectives = step.content?.objectives?.length
    ? step.content.objectives
    : ['Entender o conceito central do módulo.', 'Relacionar o conteúdo ao seu negócio.', 'Preparar ideias para a atividade prática.'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-[var(--graphite)] to-[var(--coral-neon-dark)] flex items-center justify-center relative">
          {hasVideo ? (
            <iframe
              className="w-full h-full"
              src={content.videoUrl ?? ''}
              title={content.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative flex flex-col items-center gap-3 text-center px-6">
              <PlayCircle className="w-20 h-20 text-white" />
              <p className="text-white/85 text-sm max-w-lg">Vídeo ainda não configurado.</p>
            </div>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[var(--graphite)]">{content.videoTitle}</h2>
          <p className="text-[var(--graphite)]/70 mt-2">
            Assista ao conteúdo e depois use o botão no rodapé para marcar esta etapa como concluída.
          </p>
        </div>
      </div>

      <aside className="bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm p-6 h-fit">
        <h3 className="font-bold text-[var(--graphite)] mb-3">Objetivos do vídeo</h3>
        <ul className="space-y-3 text-sm text-[var(--graphite)]/75">
          {objectives.map((objective) => (
            <li key={objective} className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--coral-neon)] shrink-0" /> {objective}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function PdfStep({ content, step }: { content: ModuleContentFallback | JornadaModuleContent; step: JornadaStep }) {
  const hasPdf = !!content.pdfUrl && !content.pdfUrl.includes('SEU_BUCKET');
  const instructions = step.content?.instructions?.length
    ? step.content.instructions
    : ['Leia o material de apoio.', 'Compare com sua resposta inicial.', 'Use as ideias na atividade final.'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200/60 dark:border-[var(--border)] bg-[var(--skin-tone-light)]/50 dark:bg-[var(--skin-tone)]">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[var(--coral-neon)]" />
            <div>
              <h2 className="font-bold text-[var(--graphite)]">{content.pdfTitle}</h2>
              <p className="text-xs text-[var(--graphite)]/60">Material de apoio do módulo</p>
            </div>
          </div>
          {hasPdf && (
            <a
              href={content.pdfUrl ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[var(--card)] border border-gray-200/70 dark:border-[var(--border)] text-[var(--graphite)] hover:border-[var(--coral-neon)]/50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Abrir/Baixar
            </a>
          )}
        </div>

        <div className="p-6 bg-gray-100/80 dark:bg-black/20 min-h-[520px] flex justify-center">
          {hasPdf ? (
            <iframe
              className="w-full min-h-[520px] rounded-xl bg-white border border-gray-200"
              src={content.pdfUrl ?? ''}
              title={content.pdfTitle}
            />
          ) : (
            <div className="w-full max-w-2xl bg-white text-gray-900 rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-center mb-6">Material ainda não configurado</h3>
              <p className="text-sm leading-7">O link do PDF poderá ser atualizado no banco pelo campo pdf_url.</p>
            </div>
          )}
        </div>
      </div>

      <aside className="bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm p-6 h-fit">
        <h3 className="font-bold text-[var(--graphite)] mb-3">Como usar o material</h3>
        <div className="space-y-3 text-sm text-[var(--graphite)]/75">
          {instructions.map((instruction, index) => (
            <div key={instruction} className="p-3 rounded-xl bg-[var(--skin-tone-light)]/70 dark:bg-[var(--skin-tone)]">
              {index + 1}. {instruction}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function ModuloPage({ moduleId, onBack, onOpenModule }: ModuloPageProps) {
  const fallbackContent = useMemo(() => moduleContent.find((item) => item.id === moduleId) ?? moduleContent[0], [moduleId]);
  const [content, setContent] = useState<ModuleContentFallback | JornadaModuleContent>(fallbackContent);
  const [activeStep, setActiveStep] = useState(0);
  const [completedStepKeys, setCompletedStepKeys] = useState<Set<string>>(new Set());
  const [activitiesByStep, setActivitiesByStep] = useState<Record<string, ModuleActivity>>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiWarning, setApiWarning] = useState('');

  const moduleSteps = useMemo(() => {
    const loadedSteps = (content as JornadaModuleContent).steps;
    return loadedSteps?.length ? loadedSteps : fallbackSteps;
  }, [content]);

  const step = moduleSteps[Math.min(activeStep, moduleSteps.length - 1)] ?? fallbackSteps[0];
  const currentActivity = activitiesByStep[step.key];
  const completedCount = completedStepKeys.size;
  const progress = moduleSteps.length ? Math.round((completedCount / moduleSteps.length) * 100) : 0;

  const loadModule = () => {
    let isMounted = true;
    setLoading(true);
    setApiWarning('');
    setSaved(false);
    setActiveStep(0);
    setContent(fallbackContent);
    setCompletedStepKeys(new Set());
    setActivitiesByStep({});
    setFormValues({});
    setChecks({});

    jornadaService
      .getModuleContent(moduleId)
      .then((module) => {
        if (!isMounted) return;
        setContent(module);
        setCompletedStepKeys(new Set((module.steps ?? []).filter((item) => item.completed).map((item) => item.key)));
        setActivitiesByStep(module.activities ?? {});
      })
      .catch(() => {
        if (isMounted) {
          setApiWarning('Não foi possível carregar este módulo do backend. Exibindo conteúdo local de fallback.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  };

  useEffect(loadModule, [fallbackContent, moduleId]);

  useEffect(() => {
    setFormValues(currentActivity?.formValues ?? {});
    setChecks(currentActivity?.checks ?? {});
    setSaved(false);
  }, [currentActivity?.stepKey, step.key]);

  const emitProgressUpdated = () => {
    window.dispatchEvent(new Event('progress:updated'));
  };

  const markCompleted = (stepKey: string) => {
    setCompletedStepKeys((current) => new Set([...Array.from(current), stepKey]));
    emitProgressUpdated();
  };

  const handleChangeValue = (field: string, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleToggleCheck = (item: string) => {
    setChecks((current) => ({ ...current, [item]: !current[item] }));
    setSaved(false);
  };

  const handleSaveDraft = async () => {
    const payload = { stepKey: step.key, formValues, checks, submitted: false };

    try {
      const activity = await jornadaService.saveModuleActivity(content.id, payload);
      setActivitiesByStep((current) => ({ ...current, [step.key]: activity }));
      setSaved(true);
    } catch {
      localStorage.setItem(`empreende_modulo_${content.id}_${step.key}`, JSON.stringify(payload));
      setApiWarning('Não consegui salvar no backend agora. O rascunho foi salvo localmente neste navegador.');
      setSaved(true);
    }
  };

  const goNext = () => {
    setActiveStep((current) => Math.min(moduleSteps.length - 1, current + 1));
  };

  const handleCompleteContentStep = async () => {
    try {
      await jornadaService.completeStep(content.id, step.key);
      markCompleted(step.key);
    } catch {
      setApiWarning('Não consegui registrar esta etapa no backend agora. Tente novamente em alguns segundos.');
      return;
    }

    goNext();
  };

  const handleSubmitActivity = async () => {
    const payload = { stepKey: step.key, formValues, checks, submitted: true };

    try {
      const activity = await jornadaService.saveModuleActivity(content.id, payload);
      setActivitiesByStep((current) => ({ ...current, [step.key]: activity }));
      markCompleted(step.key);
      setSaved(true);
    } catch {
      localStorage.setItem(`empreende_modulo_${content.id}_${step.key}`, JSON.stringify(payload));
      setApiWarning('Não consegui enviar para o backend agora. A resposta foi salva localmente neste navegador.');
      return;
    }

    const isLastStep = activeStep === moduleSteps.length - 1;
    if (isLastStep) {
      if (onOpenModule && content.id < moduleContent.length) {
        setApiWarning('Módulo finalizado. Abrindo o próximo módulo...');
        window.setTimeout(() => onOpenModule(content.id + 1), 700);
      } else {
        setApiWarning('Módulo finalizado. Você concluiu a jornada disponível.');
      }
    } else {
      goNext();
    }
  };

  const renderStep = () => {
    if (step.contentType === 'video') return <VideoStep content={content} step={step} />;
    if (step.contentType === 'pdf') return <PdfStep content={content} step={step} />;
    return (
      <ActivityForm
        step={step}
        values={formValues}
        checks={checks}
        submitted={currentActivity?.submitted}
        onChangeValue={handleChangeValue}
        onToggleCheck={handleToggleCheck}
        onSaveDraft={handleSaveDraft}
      />
    );
  };

  const footerButtonText = () => {
    if (step.contentType === 'activity') {
      if (activeStep === moduleSteps.length - 1) return step.content?.submitLabel ?? 'Finalizar módulo';
      return step.content?.submitLabel ?? 'Enviar atividade e avançar';
    }
    if (step.contentType === 'pdf') return 'Marcar leitura concluída';
    return 'Marcar vídeo assistido';
  };

  const footerAction = step.contentType === 'activity' ? handleSubmitActivity : handleCompleteContentStep;

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-2xl bg-white/95 dark:bg-[var(--card)] border border-gray-200/60 dark:border-[var(--border)] p-4 flex items-center gap-2 text-[var(--graphite)]/70">
          <Loader2 className="w-5 h-5 animate-spin" />
          Carregando dados do módulo...
        </div>
      )}

      {apiWarning && (
        <div className="rounded-2xl bg-yellow-50 text-yellow-800 border border-yellow-200 p-4">
          {apiWarning}
        </div>
      )}

      <div className="bg-white/95 dark:bg-[var(--card)] rounded-2xl p-6 border border-gray-200/60 dark:border-[var(--border)] shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[var(--graphite)]/70 hover:text-[var(--coral-neon)] transition-colors mb-5"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para minha jornada
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="text-sm text-[var(--coral-neon)] font-semibold mb-2">{content.sector}</div>
            <h1 className="text-3xl font-bold text-[var(--graphite)]">{content.title}</h1>
            <p className="text-[var(--graphite)]/70 mt-2 max-w-3xl">{content.subtitle}</p>
          </div>

          <div className="min-w-56">
            <div className="flex justify-between text-xs text-[var(--graphite)]/60 mb-2">
              <span>Progresso do módulo</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--coral-neon)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {moduleSteps.map((item, index) => {
          const Icon = item.contentType === 'video' ? PlayCircle : item.contentType === 'pdf' ? FileText : ClipboardCheck;
          const isActive = index === activeStep;
          const isDone = completedStepKeys.has(item.key);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`text-left rounded-2xl p-4 border transition-all ${
                isActive
                  ? 'bg-[var(--coral-neon)] text-white border-[var(--coral-neon)] shadow-md'
                  : 'bg-white/95 dark:bg-[var(--card)] text-[var(--graphite)] border-gray-200/60 dark:border-[var(--border)] hover:border-[var(--coral-neon)]/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)]'}`}>
                  {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className="font-bold">{item.label}</span>
              </div>
              <p className={`text-sm ${isActive ? 'text-white/85' : 'text-[var(--graphite)]/60'}`}>{item.description}</p>
            </button>
          );
        })}
      </div>

      {saved && (
        <div className="rounded-2xl bg-green-50 text-green-700 border border-green-200 p-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Registro salvo.
        </div>
      )}

      {renderStep()}

      <div className="flex items-center justify-between bg-white/95 dark:bg-[var(--card)] rounded-2xl p-4 border border-gray-200/60 dark:border-[var(--border)] shadow-sm">
        <button
          type="button"
          onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
          disabled={activeStep === 0}
          className="px-5 py-2.5 rounded-xl border border-gray-200/70 dark:border-[var(--border)] text-[var(--graphite)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--coral-neon)]/50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--graphite)]/60">
          <BookOpen className="w-4 h-4" />
          Etapa {activeStep + 1} de {moduleSteps.length}
        </div>

        <button
          type="button"
          onClick={footerAction}
          className="px-5 py-2.5 rounded-xl bg-[var(--coral-neon)] text-white hover:bg-[var(--coral-neon-dark)] transition-colors flex items-center gap-2"
        >
          {footerButtonText()}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
