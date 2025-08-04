// /app/(admin)/admin/ai-settings/_components/TemplateFormModal.js
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import { adminAISettingsService, adminLeonardoService } from '@/services/api';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TemplateFormModal.module.css';

Modal.setAppElement('body');

// Estrutura para construção guiada do 'purpose'
const purposeStructure = {
    USER: {
        character: { action: 'DRAWING', requiresElements: true, placeholders: ['[CHARACTER_DETAILS]', '[PUBLIC_IMAGE_URL]'] },
        coloring_book: { action: 'STORYLINE', requiresElements: true, placeholders: ['[CHARACTER_DETAILS]', '[THEME]', '[PAGE_COUNT]'] },
        story_book: { action: 'STORYLINE', requiresElements: true, placeholders: ['[CHARACTER_DETAILS]', '[THEME]', '[SUMMARY]', '[SCENE_COUNT]'] },
    },
    BOOK: {
        cover: { action: 'DESCRIPTION_GPT', requiresElements: false, placeholders: ['[BOOK_TITLE]', '[BOOK_GENRE]', '[CHARACTER_NAMES]'] }
    },
};

const TemplateFormModal = ({ isOpen, onClose, onSuccess, existingTemplate }) => {
    const [formData, setFormData] = useState({
        name: '',
        basePromptText: '',
        defaultElementId: '',
        coverElementId: '',
    });
    
    const [elements, setElements] = useState([]); // Lista de LeonardoElements
    
    // Estados para a construção do 'purpose' e navegação por passos
    const [currentStep, setCurrentStep] = useState(1); // 1: Prompt GPT, 2: Elements Leonardo
    const [purposeGroup, setPurposeGroup] = useState('USER');
    const [purposeFlow, setPurposeFlow] = useState('character');
    const [purposeAction, setPurposeAction] = useState('DRAWING');
    
    const [finalPurpose, setFinalPurpose] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isEditing = Boolean(existingTemplate);
    const textareaRef = useRef(null); // Ref para o textarea

    // Carrega os LeonardoElements ao abrir o modal
    useEffect(() => {
        if (isOpen) {
            const fetchElements = async () => {
                try {
                    const data = await adminLeonardoService.listElements();
                    setElements(data.filter(el => el.status === 'COMPLETE') || []);
                } catch (error) {
                    toast.error("Erro ao buscar os modelos de estilo (Elements).");
                }
            };
            fetchElements();
        }
    }, [isOpen]);

    // Lógica para construir o 'finalPurpose' e preencher seletores ao editar
    useEffect(() => {
        if (isEditing && existingTemplate) {
            setFormData({
                name: existingTemplate.name || '',
                basePromptText: existingTemplate.basePromptText || '',
                defaultElementId: existingTemplate.defaultElementId || '',
                coverElementId: existingTemplate.coverElementId || '',
            });
            setFinalPurpose(existingTemplate.purpose);

            // Tenta reconstruir os seletores para exibição
            const parts = existingTemplate.purpose.split('_');
            if (parts.length > 0) {
                setPurposeGroup(parts[0]);
                if (existingTemplate.purpose === 'BOOK_COVER_DESCRIPTION_GPT') {
                    setPurposeFlow('cover');
                    setPurposeAction('DESCRIPTION_GPT');
                } else if (parts.length >= 3) {
                    setPurposeFlow(parts[1].toLowerCase());
                    setPurposeAction(parts.slice(2).join('_'));
                }
            }
            setCurrentStep(1); // Sempre começa no passo 1 ao editar
        } else {
            // Reseta o formulário e seletores ao criar um novo
            setFormData({ name: '', basePromptText: '', defaultElementId: '', coverElementId: '' });
            setPurposeGroup('USER');
            setPurposeFlow('character');
            setPurposeAction('DRAWING');
            setCurrentStep(1); // Começa no passo 1
        }
    }, [isOpen, existingTemplate, isEditing]);
    
    // Atualiza finalPurpose quando seletores mudam (apenas no modo de criação)
    useEffect(() => {
        if (!isEditing) {
            const flowConfig = purposeStructure[purposeGroup]?.[purposeFlow];
            if (flowConfig) {
                const generatedPurpose = `${purposeGroup}_${purposeFlow.toUpperCase()}_${flowConfig.action}`;
                setFinalPurpose(generatedPurpose);
            } else {
                setFinalPurpose('');
            }
        }
    }, [purposeGroup, purposeFlow, purposeAction, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Função para inserir placeholder no textarea
    const insertPlaceholder = useCallback((placeholder) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = formData.basePromptText.substring(0, start) + placeholder + formData.basePromptText.substring(end);
        
        setFormData(prev => ({ ...prev, basePromptText: newValue }));

        // Coloca o cursor após o placeholder inserido
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
            textarea.focus();
        }, 0);
    }, [formData.basePromptText]);

    const handleNextStep = () => {
        // Validação do Passo 1
        if (currentStep === 1) {
            if (!formData.name.trim() || !finalPurpose.trim() || !formData.basePromptText.trim()) {
                toast.warn('Nome, Tipo e Texto do Prompt são obrigatórios.');
                return;
            }
            // Se o propósito não requer Elements, vai direto para o salvamento
            const currentPurposeConfig = purposeStructure[purposeGroup]?.[purposeFlow];
            if (currentPurposeConfig && !currentPurposeConfig.requiresElements) {
                handleSubmit(); // Salva direto
            } else {
                setCurrentStep(2); // Vai para o passo 2 (Elements)
            }
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(1);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault(); // Evita o comportamento padrão do form se chamado por um botão

        // Validação do Passo 2 (se aplicável)
        if (currentStep === 2) {
            const currentPurposeConfig = purposeStructure[purposeGroup]?.[purposeFlow];
            if (currentPurposeConfig && currentPurposeConfig.requiresElements) {
                if (!formData.defaultElementId) {
                    toast.warn('O Elemento de Estilo Principal é obrigatório.');
                    return;
                }
                // Capa/Contracapa só é obrigatório para livros
                if (['coloring_book', 'story_book'].includes(purposeFlow) && !formData.coverElementId) {
                    toast.warn('O Elemento de Estilo para Capa/Contracapa é obrigatório para livros.');
                    return;
                }
            }
        }

        setIsSubmitting(true);
        
        const submissionData = {
            name: formData.name.trim(),
            basePromptText: formData.basePromptText.trim(),
            defaultElementId: formData.defaultElementId || null,
            coverElementId: formData.coverElementId || null,
            isActive: true,
        };

        try {
            await adminAISettingsService.createOrUpdateSetting(finalPurpose, submissionData);
            toast.success(`Template "${formData.name}" ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            onSuccess();
        } catch (error) {
            toast.error(`Falha ao salvar template: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mapeamento dinâmico para os seletores
    const currentFlowOptions = purposeStructure[purposeGroup] || {};
    const currentPurposeConfig = purposeStructure[purposeGroup]?.[purposeFlow];
    const relevantPlaceholders = currentPurposeConfig ? currentPurposeConfig.placeholders : [];

    // Determina se o passo 2 (Elements) é necessário
    const showElementsStep = currentPurposeConfig && currentPurposeConfig.requiresElements;


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
            contentLabel={isEditing ? 'Editar Template de IA' : 'Criar Novo Template de IA'}
        >
            <h2 className={styles.modalTitle}>{isEditing ? 'Editar Template de IA' : 'Criar Novo Template de IA'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                
                <p className={styles.stepIndicator}>Passo {currentStep} de {showElementsStep && !isEditing ? '2' : '1'}: {currentStep === 1 ? 'Definir Prompt GPT' : 'Associar Elementos Leonardo'}</p>

                {/* --- PASSO 1: DEFINIR PROMPT GPT --- */}
                {currentStep === 1 && (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Nome do Template</label>
                            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Ex: Roteiro Mágico para Colorir"/>
                        </div>

                        {isEditing ? (
                            <div className={styles.formGroup}>
                                <label>Tipo (Chave do Sistema)</label>
                                <input type="text" value={finalPurpose} disabled className={styles.generatedType} />
                                <small className={styles.helperText}>A chave do sistema não pode ser alterada após a criação.</small>
                            </div>
                        ) : (
                            <>
                                <label className={styles.groupLabel}>Defina o Propósito do Template</label>
                                <div className={styles.grid}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="purposeGroup">Grupo</label>
                                        <select id="purposeGroup" value={purposeGroup} onChange={(e) => { setPurposeGroup(e.target.value); setPurposeFlow(Object.keys(purposeStructure[e.target.value])[0]); }}>
                                            {Object.keys(purposeStructure).map(group => (
                                                <option key={group} value={group}>{group.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="purposeFlow">Fluxo</label>
                                        <select id="purposeFlow" value={purposeFlow} onChange={(e) => { setPurposeFlow(e.target.value); setPurposeAction(purposeStructure[purposeGroup][e.target.value].action); }}>
                                            {Object.keys(currentFlowOptions).map(flow => (
                                                <option key={flow} value={flow}>{flow.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="purposeAction">Ação</label>
                                        <select id="purposeAction" value={purposeAction} onChange={(e) => setPurposeAction(e.target.value)} disabled> {/* Ação é determinada pelo fluxo */}
                                            <option value={purposeAction}>{purposeAction.replace(/_/g, ' ')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tipo (Chave do Sistema) Gerado</label>
                                    <input type="text" value={finalPurpose} disabled className={styles.generatedType} />
                                    <small className={styles.helperText}>Esta chave será usada pelo código para identificar este template.</small>
                                </div>
                            </>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="basePromptText">Texto do Prompt (Instruções para o GPT)</label>
                            <textarea ref={textareaRef} id="basePromptText" name="basePromptText" value={formData.basePromptText} onChange={handleChange} required rows="8" placeholder="Digite as instruções para o GPT aqui..."/>
                            <small className={styles.helperText}>
                                Este é o prompt do sistema que guiará o GPT.
                                O texto gerado pelo GPT no Leonardo.AI será inserido automaticamente onde você usar `{{GPT_OUTPUT}}` no prompt base do Element.
                            </small>
                        </div>

                        {/* Barra de Placeholders */}
                        {relevantPlaceholders.length > 0 && (
                            <div className={styles.placeholderBar}>
                                <h4>Inserir Placeholders:</h4>
                                <div className={styles.placeholderButtons}>
                                    {relevantPlaceholders.map(ph => (
                                        <button type="button" key={ph} className={styles.placeholderButton} onClick={() => insertPlaceholder(ph)}>
                                            {ph}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- PASSO 2: ASSOCIAR ELEMENTS LEONARDO --- */}
                {currentStep === 2 && showElementsStep && (
                    <div className={styles.stepContent}>
                        <div className={styles.formGroup}>
                            <label htmlFor="defaultElementId">Elemento de Estilo Principal (Leonardo.AI)</label>
                            <select id="defaultElementId" name="defaultElementId" value={formData.defaultElementId} onChange={handleChange} required={currentPurposeConfig?.requiresElements}>
                                <option value="">Selecione um Elemento...</option>
                                {elements.map(el => <option key={el.leonardoElementId} value={el.leonardoElementId}>{el.name} ({el.leonardoElementId})</option>)}
                            </select>
                            <small className={styles.helperText}>
                                Este Elemento define o estilo visual para o miolo do livro ou para a geração de personagem.
                            </small>
                        </div>

                        {/* Campo coverElementId só aparece para propósitos de livro */}
                        {['coloring_book', 'story_book'].includes(purposeFlow) && (
                            <div className={styles.formGroup}>
                                <label htmlFor="coverElementId">Elemento de Estilo para Capa/Contracapa (Leonardo.AI)</label>
                                <select id="coverElementId" name="coverElementId" value={formData.coverElementId} onChange={handleChange} required={['coloring_book', 'story_book'].includes(purposeFlow)}>
                                    <option value="">Selecione um Elemento...</option>
                                    {elements.map(el => <option key={el.leonardoElementId} value={el.leonardoElementId}>{el.name} ({el.leonardoElementId})</option>)}
                                </select>
                                <small className={styles.helperText}>
                                    Este Elemento define o estilo visual para a capa e contracapa do livro.
                                </small>
                            </div>
                        )}
                    </div>
                )}
                
                <div className={styles.modalActions}>
                    {currentStep > 1 && (
                        <button type="button" className={styles.navButton} onClick={handlePrevStep} disabled={isSubmitting}>
                            Voltar
                        </button>
                    )}
                    {currentStep === 1 && showElementsStep && !isEditing ? (
                        <button type="button" className={styles.navButton} onClick={handleNextStep} disabled={isSubmitting}>
                            Próximo
                        </button>
                    ) : (
                        <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Template'}
                        </button>
                    )}
                    <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default TemplateFormModal;