'use client'
import { Select, Input, message, Alert, Popover } from 'antd';
const { TextArea } = Input;
import Link from 'next/link';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { SwapOutlined, HolderOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState, useRef, useEffect } from 'react';
import MoonshotTranslater from '@/app/adapter/moonshot/translater';
import OpenaiTranslater from '@/app/adapter/openai/translater';
import ClaudeTranslater from '@/app/adapter/claude/translater';
import YiyanTranslater from '@/app/adapter/yiyan/translater';

import openaiLogo from '@/app/images/providers/openai.png';
import yiyanLogo from '@/app/images/providers/yiyan.svg';
import claudeLogo from '@/app/images/providers/claude.png';
import moonshotLogo from '@/app/images/providers/moonshot.png';

export default function Home() {
  const t = useTranslations('HomePage');
  const l = useTranslations('Language');
  const [messageApi, contextHolder] = message.useMessage();
  const [showNotice, setShowNotice] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedFromLanguage, setSelectedFromLanguage] = useState('Auto');
  const [selectedToLanguage, setSelectedToLanguage] = useState('Simplified Chinese');

  const [isLoading, setIsLoading] = useState(false);
  const openaiRef = useRef();
  const claudeRef = useRef();
  const moonshotRef = useRef();
  const yiyanRef = useRef();
  const handleInputTextChange = (value: string) => {
    setInputText(value)
  };

  const clearInput = () => {
    setInputText('');
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText(); // 读取剪贴板内容
      setInputText(text); // 将内容设置到输入框
    } catch (err) {
      messageApi.error('读取剪贴板失败，请手动粘贴');
    }
  };
  const startTranslate = () => {
    if (!inputText) {
      return;
    }
    setIsLoading(true);
    if (openaiRef.current) {
      (openaiRef.current as any).startTranslate(selectedFromLanguage, selectedToLanguage, inputText, () => { setIsLoading(false); });
    }
    if (claudeRef.current) {
      (claudeRef.current as any).startTranslate(selectedFromLanguage, selectedToLanguage, inputText, () => { setIsLoading(false); });
    }
    if (moonshotRef.current) {
      (moonshotRef.current as any).startTranslate(selectedFromLanguage, selectedToLanguage, inputText, () => { setIsLoading(false); });
    }
    if (yiyanRef.current) {
      (yiyanRef.current as any).startTranslate(selectedFromLanguage, selectedToLanguage, inputText, () => { setIsLoading(false); });
    }
  }


  const handleFromLanguage = (value: React.SetStateAction<string>) => {
    setSelectedFromLanguage(value)
  }

  const handleToLanguage = (value: React.SetStateAction<string>) => {
    setSelectedToLanguage(value)
  }

  const [providers, setProviders] = useState([
    { id: 'openai', DisplayName: 'Open AI', logo: openaiLogo, provider: OpenaiTranslater, ref: openaiRef },
    { id: 'claude', DisplayName: 'Claude', logo: claudeLogo, provider: ClaudeTranslater, ref: claudeRef },
    { id: 'moonshot', DisplayName: 'Moonshot', logo: moonshotLogo, provider: MoonshotTranslater, ref: moonshotRef },
    { id: 'yiyan', DisplayName: '百度千帆/文心一言', logo: yiyanLogo, provider: YiyanTranslater, ref: yiyanRef },
  ]);

  const [localProviders, setLocalProviders] = useState<typeof providers>([]);
  const [toAddProviders, setToAddProviders] = useState(providers);

  useEffect(() => {
    const localSavedProvidersString = localStorage.getItem('localSavedProviders');
    let localSavedProviders: string[];
    try {
      localSavedProviders = JSON.parse(localSavedProvidersString || '[]');
    } catch (e) {
      localSavedProviders = [];
    }
    if (localSavedProviders.length > 0) {
      const filteredArr = localSavedProviders
        .map((item: any) => providers.find(provider => provider.id === item))
        .filter(item => item !== undefined); // 过滤掉 undefined
      setLocalProviders(filteredArr);
    }
  }, [providers]);

  useEffect(() => {
    const toAddProvidersArr = providers.filter(item => !localProviders.some(local => local.id === item.id));
    setToAddProviders(toAddProvidersArr);
  }, [localProviders, providers]);

  useEffect(() => {
    if (
      localStorage.getItem('claude_status') === 'true' ||
      localStorage.getItem('moonshot_status') === 'true' ||
      localStorage.getItem('openai_status') === 'true' ||
      localStorage.getItem('yiyan_status') === 'true') {
      setShowNotice(false);
    } else {
      setLocalProviders(providers);
      setShowNotice(true);
    }
  }, [providers]);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const newItems = Array.from(localProviders);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    const localSavedProviders = newItems.map((i) => {
      return i.id;
    });
    localStorage.setItem('localSavedProviders', JSON.stringify(localSavedProviders));
    setLocalProviders(newItems);
  };

  const swapLanguage = () => {
    if (selectedFromLanguage === 'Auto' && selectedToLanguage === 'Simplified Chinese') {
      setSelectedFromLanguage('Simplified Chinese');
      setSelectedToLanguage('English');
      return;
    } else if (selectedFromLanguage === 'Auto') {
      setSelectedFromLanguage(selectedToLanguage);
      setSelectedToLanguage('Simplified Chinese');
    } else {
      const temp = selectedFromLanguage;
      setSelectedFromLanguage(selectedToLanguage);
      setSelectedToLanguage(temp);
    }
  }

  const HideProvider = (providerId: string) => {
    const filteredArr = localProviders.filter(item => item.id !== providerId);
    setLocalProviders(filteredArr);
    const localSavedProvidersString = filteredArr.map((i) => {
      return i.id;
    });
    localStorage.setItem('localSavedProviders', JSON.stringify(localSavedProvidersString));
  }
  const handleAddProvider = (providerId: string) => {
    const exits = localProviders.some((currentValue) => {
      return providerId === currentValue.id;
    })
    if (exits) return;
    const toAddProvider = providers.find((item) => {
      return item.id === providerId;
    })
    if (toAddProvider) {
      const localSavedProvidersString = localProviders.map((i) => {
        return i.id;
      });
      localStorage.setItem('localSavedProviders', JSON.stringify([...localSavedProvidersString, providerId]));
      setLocalProviders((m) => ([...m, toAddProvider]));
    }
  }

  return (
    <div className="container flex flex-col justify-center">
      {showNotice ? <div className="container flex flex-row mt-4 justify-center px-4 md:px-0">
        <Alert
          className='w-full max-w-screen-xl align-middle'
          message={<span>{t('noProviderNotice')}<Link href='/settings/providers'>{t('clickHere')}</Link></span>}
          type="warning"
          closable
        />
      </div> : ''}
      <div className="container flex flex-row justify-center">
        {contextHolder}
        <div className='container max-w-screen-xl mb-8'>
          <h2 className="mt-4 text-xl transition-colors mx-4 md:mx-0">{t('aiTranslate')}</h2>
          <div className="grid mt-4 md:grid-cols-2 md:mx-0 md:gap-4 grid-cols-1 gap-0 mx-4">
            <div>
              <div className='flex flex-row'>
                <Select
                  defaultValue="Auto"
                  value={selectedFromLanguage}
                  size='large'
                  id='fromLanguage'
                  className='w-0 flex-grow'
                  onChange={handleFromLanguage}
                  options={[
                    { value: 'Auto', label: l('auto') },
                    { value: 'English', label: l('english') },
                    { value: 'Simplified Chinese', label: l('simplifiedChinese') },
                    { value: 'Traditional Chinese', label: l('traditionalChinese') },
                    { value: 'Japanese', label: l('japanese') },
                    { value: 'Korean', label: l('korean') },
                    { value: 'French', label: l('french') },
                    { value: 'German', label: l('german') },
                    { value: 'Spanish', label: l('spanish') },
                  ]}
                />
                <Button
                  className='flex-grow-0 m-2'
                  type='text'
                  onClick={swapLanguage}
                  icon={<SwapOutlined style={{ color: '#ccc', }} />} size='small' />
                <Select
                  defaultValue="Simplified Chinese"
                  value={selectedToLanguage}
                  id='toLanguage'
                  size='large'
                  className='w-0 flex-grow'
                  onChange={handleToLanguage}
                  options={[
                    { value: 'Simplified Chinese', label: l('simplifiedChinese') },
                    { value: 'Traditional Chinese', label: l('traditionalChinese') },
                    { value: 'English', label: l('english') },
                    { value: 'Japanese', label: l('japanese') },
                    { value: 'Korean', label: l('korean') },
                    { value: 'French', label: l('french') },
                    { value: 'German', label: l('german') },
                    { value: 'Spanish', label: l('spanish') },
                  ]}
                />
              </div>
              <div className='mt-4'>
                <TextArea
                  style={{ paddingTop: '0.5em' }}
                  className='leading-4'
                  value={inputText}
                  name='inputText'
                  onChange={(e) => handleInputTextChange(e.target.value)}
                  rows={14} />
              </div>
              <div className='mt-4 flex justify-between'>
                <div>
                  <Button onClick={handlePaste}>{t('paste')}</Button>
                  <Button className='ml-4' onClick={clearInput}>{t('clear')}</Button>
                </div>
                <Button type='primary' loading={isLoading} onClick={startTranslate}>{t('translate')}</Button>
              </div>
            </div>
            <div>
              <div className='mt-6 md:-mt-10'>
                <div className='flex flex-row-reverse h-10 flex-end'>
                  <Popover placement="bottomRight"
                    trigger="click"
                    content={
                      <div className='w-44'>
                        {
                          toAddProviders.length === 0 && <span className='text-gray-500'>已全部添加</span>
                        }
                        {toAddProviders.length > 0 &&
                          toAddProviders.map((item, index) => (
                            <div key={item.id}
                              onClick={() => { handleAddProvider(item.id) }}
                              className='flex flex-row hover:bg-gray-100 rounded-lg p-2 items-center cursor-pointer'>
                              <Image src={item.logo} className='border rounded-full p-1 mr-2' width={26} height={26} alt='openai' />
                              <span>{item.DisplayName}</span>
                            </div>
                          )
                          )
                        }
                      </div>} arrow={false}>
                    <Button type='link' className='mr-3'>{t('addProvider')}</Button>
                  </Popover>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="list">
                    {(provided) => (
                      <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {localProviders.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                className='flex flex-row w-full'
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  margin: '0 0 12px 0',
                                  ...provided.draggableProps.style
                                }}
                              >
                                <div>
                                  <HolderOutlined style={{
                                    color: '#ccc',
                                  }} className='flex-grow-0 mt-4 mr-1 hover:cursor-move hover:text-gray-800'{...provided.dragHandleProps} />
                                </div>
                                <div className='flex flex-grow w-0'>
                                  {<item.provider ref={item.ref} />}
                                </div>
                                <div className=''>
                                  <Button
                                    className='flex-grow-0 ml-1 mt-3'
                                    type='text'
                                    onClick={() => {
                                      HideProvider(item.id)
                                    }}
                                    icon={<CloseOutlined style={{ color: '#ccc', }} />} size='small' />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
