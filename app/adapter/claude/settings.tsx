'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Modal, Select } from 'antd';
import { Divider } from 'antd';
import { Button, Form, Input, Switch, ConfigProvider, message } from 'antd';
import anthropic from "./anthropic.svg";
import claudeLogo from "./claude_logo.svg";
import claudeText from "./claude_text.svg";
import { modelList } from './models';
import { addIfNotExists, removeIfExists } from '@/app/unils';
import { useTranslations } from 'next-intl';

type FormValues = {
  status: boolean;
  apikey: string;
  proxy_url: string;
  model: string;
}

const ClaudeSettings = () => {
  const c = useTranslations('Common');
  const t = useTranslations('Settings');
  const [messageApi, contextHolder] = message.useMessage();
  const [claudeStatus, setClaudeStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved_claude_status: boolean = localStorage.getItem('claude_status') === "true" || false;
    const saved_claude_api_key = localStorage.getItem('claude_api_key') || '';
    const saved_claude_proxy_url = localStorage.getItem('claude_proxy_url') || '';
    const saved_claude_model = localStorage.getItem('claude_model') || modelList[0]['name'];
    setClaudeStatus(saved_claude_status);
    form.setFieldValue("status", saved_claude_status);
    form.setFieldValue("apikey", saved_claude_api_key);
    form.setFieldValue("proxy_url", saved_claude_proxy_url);
    form.setFieldValue("model", saved_claude_model);
  }, [form]);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const clearLocalSetting = () => {
    setClaudeStatus(false);
    localStorage.removeItem('claude_status');
    localStorage.removeItem('claude_api_key');
    localStorage.removeItem('claude_proxy_url');
    localStorage.removeItem('claude_model');
    form.setFieldValue("status", false);
    form.setFieldValue("apikey", '');
    form.setFieldValue("proxy_url", '');
    messageApi.success('清除本地设置成功');
    setIsModalOpen(false);
  };
  const onFinish = (values: FormValues) => {
    setClaudeStatus(values.status);
    localStorage.setItem('claude_status', String(values.status));
    localStorage.setItem('claude_api_key', values.apikey);
    localStorage.setItem('claude_proxy_url', values.proxy_url);
    localStorage.setItem('claude_model', values.model);

    const localSavedProvidersString = localStorage.getItem('localSavedProviders');
    let localSavedProviders = localSavedProvidersString ? JSON.parse(localSavedProvidersString) : []
    if (values.status) {
      localSavedProviders = addIfNotExists(localSavedProviders, 'claude')
    } else {
      localSavedProviders = removeIfExists(localSavedProviders, 'claude')
    }
    localStorage.setItem('localSavedProviders', JSON.stringify(localSavedProviders));

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className='flex flex-row justify-between mt-4 items-center p-2 w-full h-16 bg-white border border-gray-200 rounded-lg'>
      {contextHolder}
      <div className='flex flex-row items-center'>
        <Image src={claudeLogo} className='h-6 w-auto ml-1' alt="Claude Logo" />
        <Image src={claudeText} className='h-4 w-auto ml-1' alt="Claude Text" />
        <Divider type="vertical" />
        <Image src={anthropic} className='h-6 w-auto ml-1' alt="Anthropic" />
      </div>
      <div className='flex flex-row items-center'>
        {claudeStatus ?
          <>
            <div className='w-2 h-2 bg-green-500 rounded m-2'></div>
            <span className='mr-4 text-sm'>{t('enabled')}</span></>
          :
          <><div className='w-2 h-2 bg-gray-400 rounded m-2'></div>
            <span className='mr-4 text-sm'>{t('disabled')}</span>
          </>}
        <Button className='text-xs mr-2' onClick={showModal}>{c('settings')}</Button>
      </div>
      <Modal title={`Claude ${c('settings')}`}
        okText={t('save')}
        cancelText={t('cancel')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <div className='flex flex-row justify-between'>
            <div>
              <Link
                target='_blank'
                href='https://k2swpw8zgf.feishu.cn/wiki/XrMdwQlRKiOESdkdexMcQ89vn2e'
              >
                {t('configGuide')}
              </Link>
            </div>
            <div>
              <Button key="back" className='mr-2' onClick={handleCancel}>
                {t('cancel')}
              </Button>
              <Button key="submit" type="primary" onClick={handleOk}>
                {t('save')}
              </Button>
            </div>
          </div>
        }
      >
        <div className='mt-4'></div>
        <ConfigProvider
          theme={{
            components: {
              Form: {
                itemMarginBottom: 12,
              },
            },
          }}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item label={t('status')} name='status'>
              <Switch defaultChecked={false} />
            </Form.Item>
            <Form.Item label="API Key" name='apikey'>
              <Input />
            </Form.Item>
            <Form.Item label={`${t('endpoint')} (${t('optional')})`} name='proxy_url'>
              <Input type='url' />
            </Form.Item>
            <Form.Item label={t('defaultModel')} name='model'>
              <Select
                id='model'
                className='w-0 flex-grow'
                options={
                  modelList.map(model => ({
                    value: model.name,
                    label: model.displayName
                  }))
                }
              />
            </Form.Item>
          </Form>
        </ConfigProvider>
      </Modal>
    </div>
  );
};

export default ClaudeSettings;
