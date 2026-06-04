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
import { jornadaService, type JornadaModuleContent } from '../../services/jornadaService';

interface ModuloPageProps {
  moduleId: number;
  onBack: () => void;
}

type StepKey = 'video' | 'avaliacao1' | 'pdf' | 'avaliacao2';

interface ModuleContent {
  id: number;
  sector: string;
  title: string;
  subtitle: string;
  videoTitle: string;
  videoUrl?: string | null;
  pdfTitle: string;
  pdfUrl?: string | null;
}

const moduleContent: ModuleContent[] = [
  {
    id: 1,
    sector: 'Empresas de alimentos / comércio de alimentos',
    title: 'Missão, visão e valores',
    subtitle: 'Construa a base estratégica da sua empresa a partir de propósito, futuro desejado e princípios de atuação.',
    videoTitle: 'Como definir missão, visão e valores para empresas de alimentos',
    pdfTitle: 'Guia prático: missão, visão e valores para empresas de alimentos',
  },
  {
    id: 2,
    sector: 'Empresas de alimentos / comércio de alimentos',
    title: 'Análise de mercado',
    subtitle: 'Observe público, concorrentes e oportunidades para melhorar o posicionamento do negócio.',
    videoTitle: 'Introdução à análise de mercado para pequenos negócios',
    pdfTitle: 'Roteiro de análise de mercado e concorrência',
  },
  {
    id: 3,
    sector: 'Empresas de alimentos / comércio de alimentos',
    title: 'Modelo de negócio',
    subtitle: 'Organize proposta de valor, canais, fontes de receita e relacionamento com clientes.',
    videoTitle: 'Como estruturar um modelo de negócio simples e viável',
    pdfTitle: 'Canvas aplicado ao comércio de alimentos',
  },
];

const steps: Array<{ key: StepKey; label: string; description: string; icon: typeof PlayCircle }> = [
  { key: 'video', label: 'Vídeo', description: 'Assista à explicação inicial', icon: PlayCircle },
  { key: 'avaliacao1', label: 'Atividade 1', description: 'Produza sua primeira resposta', icon: ClipboardCheck },
  { key: 'pdf', label: 'PDF', description: 'Consulte o material de apoio', icon: FileText },
  { key: 'avaliacao2', label: 'Atividade 2', description: 'Revise e aperfeiçoe a resposta', icon: CheckCircle },
];

const checklistItems = [
  'A missão explica claramente o que a empresa faz?',
  'A visão apresenta um objetivo futuro possível de alcançar?',
  'Os valores orientam decisões e comportamentos da empresa?',
  'O texto está simples, direto e coerente com o tipo de negócio?',
];

interface ActivityFormProps {
  title: string;
  description: string;
  values: Record<string, string>;
  checks: Record<string, boolean>;
  finalReview?: boolean;
  onChangeValue: (field: string, value: string) => void;
  onToggleCheck: (item: string) => void;
  onSave: () => void;
}

function ActivityForm({
  title,
  description,
  values,
  checks,
  finalReview = false,
  onChangeValue,
  onToggleCheck,
  onSave,
}: ActivityFormProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--graphite)]">{title}</h2>
          <p className="text-[var(--graphite)]/70 mt-1">{description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--graphite)] mb-2">Missão</label>
            <textarea
              value={values.missao}
              onChange={(event) => onChangeValue('missao', event.target.value)}
              placeholder="Ex.: Oferecer alimentos frescos, acessíveis e de qualidade para a comunidade local."
              className="w-full min-h-24 p-4 rounded-2xl bg-[var(--skin-tone-light)]/50 dark:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/40 text-[var(--graphite)] outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/40"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--graphite)] mb-2">Visão</label>
            <textarea
              value={values.visao}
              onChange={(event) => onChangeValue('visao', event.target.value)}
              placeholder="Ex.: Ser reconhecida como referência regional em atendimento e qualidade alimentar."
              className="w-full min-h-24 p-4 rounded-2xl bg-[var(--skin-tone-light)]/50 dark:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/40 text-[var(--graphite)] outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/40"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--graphite)] mb-2">Valores</label>
            <textarea
              value={values.valores}
              onChange={(event) => onChangeValue('valores', event.target.value)}
              placeholder="Ex.: qualidade, confiança, respeito, responsabilidade, atendimento humanizado."
              className="w-full min-h-24 p-4 rounded-2xl bg-[var(--skin-tone-light)]/50 dark:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/40 text-[var(--graphite)] outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/40"
            />
          </div>

          {finalReview && (
            <div>
              <label className="block text-sm font-semibold text-[var(--graphite)] mb-2">O que você melhorou após consultar o PDF?</label>
              <textarea
                value={values.revisao}
                onChange={(event) => onChangeValue('revisao', event.target.value)}
                placeholder="Descreva os principais ajustes feitos na sua missão, visão e valores."
                className="w-full min-h-24 p-4 rounded-2xl bg-[var(--skin-tone-light)]/50 dark:bg-[var(--skin-tone)] border border-[var(--skin-tone-dark)]/40 text-[var(--graphite)] outline-none focus:ring-2 focus:ring-[var(--coral-neon)]/40"
              />
            </div>
          )}
        </div>
      </div>

      <aside className="bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm p-6 h-fit">
        <h3 className="font-bold text-[var(--graphite)] mb-2">Checklist da atividade</h3>
        <p className="text-sm text-[var(--graphite)]/60 mb-4">Marque os critérios que sua resposta já atende.</p>

        <div className="space-y-3">
          {checklistItems.map((item) => (
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
          onClick={onSave}
          className="mt-6 w-full py-3 rounded-2xl bg-[var(--coral-neon)] text-white font-semibold shadow-md hover:bg-[var(--coral-neon-dark)] transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Salvar rascunho
        </button>
      </aside>
    </div>
  );
}

function VideoStep({ content }: { content: ModuleContent }) {
  const hasVideo = !!content.videoUrl && !content.videoUrl.includes('VIDEO_MODULO');

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
            <>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_white,_transparent_35%)]" />
              <div className="relative flex flex-col items-center gap-3 text-center px-6">
                <button className="w-24 h-24 rounded-full bg-white/95 text-[var(--coral-neon)] shadow-xl flex items-center justify-center hover:scale-105 transition-transform">
                  <PlayCircle className="w-14 h-14" />
                </button>
                <p className="text-white/85 text-sm max-w-lg">
                  O espaço do vídeo já está conectado ao campo <strong>video_url</strong> do banco.
                  Troque o link placeholder pelo link incorporável do vídeo.
                </p>
              </div>
            </>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[var(--graphite)]">{content.videoTitle}</h2>
          <p className="text-[var(--graphite)]/70 mt-2">
            Neste primeiro momento, o aluno assiste ao conteúdo explicativo e identifica exemplos antes de iniciar a atividade prática.
          </p>
        </div>
      </div>

      <aside className="bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm p-6 h-fit">
        <h3 className="font-bold text-[var(--graphite)] mb-3">Objetivos do vídeo</h3>
        <ul className="space-y-3 text-sm text-[var(--graphite)]/75">
          <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-[var(--coral-neon)] shrink-0" /> Entender a diferença entre missão, visão e valores.</li>
          <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-[var(--coral-neon)] shrink-0" /> Relacionar os conceitos ao setor de alimentos.</li>
          <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-[var(--coral-neon)] shrink-0" /> Preparar ideias para a primeira atividade.</li>
        </ul>
      </aside>
    </div>
  );
}

function PdfStep({ content }: { content: ModuleContent }) {
  const hasPdf = !!content.pdfUrl && !content.pdfUrl.includes('SEU_BUCKET');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200/60 dark:border-[var(--border)] bg-[var(--skin-tone-light)]/50 dark:bg-[var(--skin-tone)]">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[var(--coral-neon)]" />
            <div>
              <h2 className="font-bold text-[var(--graphite)]">{content.pdfTitle}</h2>
              <p className="text-xs text-[var(--graphite)]/60">Visualização de PDF do módulo</p>
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
              <div className="text-xs text-gray-500 mb-5">1 - {content.sector}</div>
              <div className="border-2 border-gray-900 rounded-2xl p-6 min-h-[430px]">
                <div className="border border-gray-900 rounded-xl px-4 py-2 text-center text-sm font-semibold mb-6">
                  {content.title} para empresas de alimentos
                </div>
                <h3 className="text-xl font-bold text-center mb-6">Missão, Visão e Valores</h3>
                <p className="text-sm leading-7 mb-4">
                  A missão apresenta a razão de existir da empresa. A visão mostra onde o negócio deseja chegar. Os valores indicam os princípios que orientam decisões, atendimento e relacionamento com clientes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  {['Missão', 'Visão', 'Valores'].map((item) => (
                    <div key={item} className="border border-gray-900 rounded-xl p-4 min-h-28">
                      <h4 className="font-bold mb-2">{item}</h4>
                      <p className="text-xs text-gray-600">Campo de apoio conceitual para revisão da atividade.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="bg-white/95 dark:bg-[var(--card)] rounded-2xl border border-gray-200/60 dark:border-[var(--border)] shadow-sm p-6 h-fit">
        <h3 className="font-bold text-[var(--graphite)] mb-3">Como usar o PDF</h3>
        <p className="text-sm text-[var(--graphite)]/70 mb-4">
          O PDF funciona como apoio entre a primeira tentativa e a atividade final. A ideia é comparar sua resposta inicial com os critérios do material.
        </p>
        <div className="space-y-3 text-sm text-[var(--graphite)]/75">
          <div className="p-3 rounded-xl bg-[var(--skin-tone-light)]/70 dark:bg-[var(--skin-tone)]">1. Leia os conceitos principais.</div>
          <div className="p-3 rounded-xl bg-[var(--skin-tone-light)]/70 dark:bg-[var(--skin-tone)]">2. Compare com sua atividade 1.</div>
          <div className="p-3 rounded-xl bg-[var(--skin-tone-light)]/70 dark:bg-[var(--skin-tone)]">3. Reescreva na atividade 2.</div>
        </div>
      </aside>
    </div>
  );
}

export function ModuloPage({ moduleId, onBack }: ModuloPageProps) {
  const fallbackContent = useMemo(() => moduleContent.find((item) => item.id === moduleId) ?? moduleContent[0], [moduleId]);
  const [content, setContent] = useState<ModuleContent | JornadaModuleContent>(fallbackContent);
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({
    missao: '',
    visao: '',
    valores: '',
    revisao: '',
  });
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiWarning, setApiWarning] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setApiWarning('');
    setContent(fallbackContent);

    jornadaService
      .getModuleContent(moduleId)
      .then((module) => {
        if (!isMounted) return;
        setContent(module);
        if (module.activity?.formValues) {
          setFormValues((current) => ({ ...current, ...module.activity?.formValues }));
        }
        if (module.activity?.checks) {
          setChecks(module.activity.checks);
        }
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
  }, [fallbackContent, moduleId]);

  const step = steps[activeStep];
  const progress = Math.round(((activeStep + 1) / steps.length) * 100);

  const handleChangeValue = (field: string, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleToggleCheck = (item: string) => {
    setChecks((current) => ({ ...current, [item]: !current[item] }));
    setSaved(false);
  };

  const handleSave = async () => {
    const payload = { stepKey: step.key, formValues, checks, submitted: false };

    try {
      await jornadaService.saveModuleActivity(content.id, payload);
      await jornadaService.completeStep(content.id, step.key);
    } catch {
      localStorage.setItem(`empreende_modulo_${content.id}_atividade`, JSON.stringify(payload));
      setApiWarning('Não consegui salvar no backend agora. O rascunho foi salvo localmente neste navegador.');
    } finally {
      setSaved(true);
    }
  };

  const handleNext = async () => {
    try {
      await jornadaService.completeStep(content.id, step.key);
    } catch {
      // Se a API estiver fora do ar, a navegação continua e o aluno não fica travado.
    } finally {
      setActiveStep((current) => Math.min(steps.length - 1, current + 1));
    }
  };

  const renderStep = () => {
    if (step.key === 'video') return <VideoStep content={content} />;
    if (step.key === 'pdf') return <PdfStep content={content} />;
    if (step.key === 'avaliacao1') {
      return (
        <ActivityForm
          title="Atividade prática 1"
          description="Escreva uma primeira versão da missão, visão e valores da sua empresa. Neste momento, o mais importante é registrar suas ideias iniciais."
          values={formValues}
          checks={checks}
          onChangeValue={handleChangeValue}
          onToggleCheck={handleToggleCheck}
          onSave={handleSave}
        />
      );
    }
    return (
      <ActivityForm
        title="Atividade prática 2"
        description="Após consultar o PDF, revise sua resposta e faça uma versão mais clara, objetiva e alinhada ao negócio."
        values={formValues}
        checks={checks}
        finalReview
        onChangeValue={handleChangeValue}
        onToggleCheck={handleToggleCheck}
        onSave={handleSave}
      />
    );
  };

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
              <span>Progresso da aula</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-[var(--skin-tone-light)] dark:bg-[var(--skin-tone)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--coral-neon)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeStep;
          const isDone = index < activeStep;
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
          Rascunho salvo.
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
          Etapa {activeStep + 1} de {steps.length}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          className="px-5 py-2.5 rounded-xl bg-[var(--coral-neon)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--coral-neon-dark)] transition-colors flex items-center gap-2"
        >
          Próximo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
