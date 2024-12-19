'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Button, Form, Input, Switch, Select, ConfigProvider, message } from 'antd';
import logo from "./logo.png";
import { modelList } from './models';
import { addIfNotExists, removeIfExists } from '@/app/unils';
import { useTranslations } from 'next-intl';

type FormValues = {
  status: boolean;
  apikey: string;
  model: string;
}

const MoonshotSettings = () => {
  const c = useTranslations('Common');
  const t = useTranslations('Settings');
  const [messageApi, contextHolder] = message.useMessage();
  const [moonshotStatus, setMoonshotStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved_moonshot_status: boolean = localStorage.getItem('moonshot_status') === "true" || false;
    const saved_moonshot_api_key = localStorage.getItem('moonshot_api_key') || '';
    const saved_moonshot_model = localStorage.getItem('moonshot_model') || modelList[0]['name'];
    setMoonshotStatus(saved_moonshot_status);
    form.setFieldValue("status", saved_moonshot_status);
    form.setFieldValue("apikey", saved_moonshot_api_key);
    form.setFieldValue("model", saved_moonshot_model);
  }, [form]);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const clearLocalSetting = () => {
    setMoonshotStatus(false);
    localStorage.removeItem('moonshot_status');
    localStorage.removeItem('moonshot_api_key');
    localStorage.removeItem('moonshot_model');
    form.setFieldValue("status", false);
    form.setFieldValue("apikey", '');
    form.setFieldValue("model", '');
    messageApi.success('清除本地设置成功');
    setIsModalOpen(false);
  };

  const onFinish = (values: FormValues) => {
    setMoonshotStatus(values.status);
    localStorage.setItem('moonshot_status', String(values.status));
    localStorage.setItem('moonshot_api_key', values.apikey);
    localStorage.setItem('moonshot_model', values.model);

    const localSavedProvidersString = localStorage.getItem('localSavedProviders');
    let localSavedProviders = localSavedProvidersString ? JSON.parse(localSavedProvidersString) : []
    if (values.status) {
      localSavedProviders = addIfNotExists(localSavedProviders, 'moonshot')
    } else {
      localSavedProviders = removeIfExists(localSavedProviders, 'moonshot')
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
      <Image src={logo} className='h-6 w-auto ml-1' alt="Moonshot" />
      <div className='flex flex-row items-center'>
        {moonshotStatus ?
          <>
            <div className='w-2 h-2 bg-green-500 rounded m-2'></div>
            <span className='mr-4 text-sm'>{t('enabled')}</span></>
          :
          <><div className='w-2 h-2 bg-gray-400 rounded m-2'></div>
            <span className='mr-4 text-sm'>{t('disabled')}</span>
          </>}
          <Button className='text-xs mr-2' onClick={showModal}>{c('settings')}</Button>
      </div>
      <Modal title={`Moonshot ${c('settings')}`}
        okText='保存'
        cancelText='取消'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <div className='flex flex-row justify-between'>
            <div>
              <Link
                target='_blank'
                href='https://k2swpw8zgf.feishu.cn/wiki/ZqM3wCfDViRFxJkHGP4c9imsnig'
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

export default MoonshotSettings;
