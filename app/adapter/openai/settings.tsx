'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Button, Form, Input, Switch, ConfigProvider, message, Select } from 'antd';
import logo from "./logo.svg";
import { modelList } from './models';
import { addIfNotExists, removeIfExists } from '@/app/unils'

type FormValues = {
  status: boolean;
  apikey: string;
  proxy_url: string;
  model: string;
}

const OpenAiSettings = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [openAiStatus, setOpenAiStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved_openai_status: boolean = localStorage.getItem('openai_status') === "true" || false;
    const saved_openai_api_key = localStorage.getItem('openai_api_key') || '';
    const saved_openai_proxy_url = localStorage.getItem('openai_proxy_url') || '';
    const saved_openai_model = localStorage.getItem('openai_model') || modelList[0]['name'];
    setOpenAiStatus(saved_openai_status);
    form.setFieldValue("status", saved_openai_status);
    form.setFieldValue("apikey", saved_openai_api_key);
    form.setFieldValue("proxy_url", saved_openai_proxy_url);
    form.setFieldValue("model", saved_openai_model);
  }, [form]);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const clearLocalSetting = () => {
    setOpenAiStatus(false);
    localStorage.removeItem('openai_status');
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('openai_proxy_url');
    localStorage.removeItem('openai_model');
    form.setFieldValue("status", false);
    form.setFieldValue("apikey", '');
    form.setFieldValue("proxy_url", '');
    messageApi.success('清除本地设置成功');
    setIsModalOpen(false);
  };
  const onFinish = (values: FormValues) => {
    setOpenAiStatus(values.status);
    localStorage.setItem('openai_status', String(values.status));
    localStorage.setItem('openai_api_key', values.apikey);
    localStorage.setItem('openai_proxy_url', values.proxy_url);
    localStorage.setItem('openai_model', values.model);

    const localSavedProvidersString = localStorage.getItem('localSavedProviders');
    let localSavedProviders = localSavedProvidersString ? JSON.parse(localSavedProvidersString) : []
    if (values.status) {
      localSavedProviders = addIfNotExists(localSavedProviders, 'openai')
    } else {
      localSavedProviders = removeIfExists(localSavedProviders, 'openai')
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
      <Image src={logo} className='h-6 w-auto ml-1' alt="Open AI" />
      <div className='flex flex-row items-center'>
        {openAiStatus ?
          <>
            <div className='w-2 h-2 bg-green-500 rounded m-2'></div>
            <span className='mr-4 text-sm'>已启用</span></>
          :
          <><div className='w-2 h-2 bg-gray-400 rounded m-2'></div>
            <span className='mr-4 text-sm'>未启用</span>
          </>}
        <Button className='text-xs mr-2' onClick={showModal}>设置</Button>
      </div>
      <Modal title="设置 Open AI"
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
                href='https://k2swpw8zgf.feishu.cn/wiki/J3FtwGumMi7k0vktB41cHvjTnTg'
              >
                查看设置引导
              </Link>
            </div>
            <div>
              <Button key="back" className='mr-2' onClick={handleCancel}>
                取消
              </Button>
              <Button key="submit" type="primary" onClick={handleOk}>
                保存
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
            <Form.Item label="启用" name='status'>
              <Switch defaultChecked={false} />
            </Form.Item>
            <Form.Item label="API Key" name='apikey'>
              <Input />
            </Form.Item>
            <Form.Item label="中转地址(选填)" name='proxy_url'>
              <Input type='url' />
            </Form.Item>
            <Form.Item label="翻译时默认使用的模型" name='model'>
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

export default OpenAiSettings;
