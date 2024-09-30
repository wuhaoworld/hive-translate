'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import Link from 'next/link';
import { Button, Form, Input, Select, Switch, ConfigProvider, message } from 'antd';
import logo from "./logo.png"
import { modelList } from './models';
import { addIfNotExists, removeIfExists } from '@/app/unils'

type FormValues = {
  status: boolean;
  apikey: string;
  apisecret: string;
  model: string;
}

const YiyanSettings = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [yiyanStatus, setYiyanStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved_yiyan_status: boolean = localStorage.getItem('yiyan_status') === "true" || false;
    const saved_yiyan_api_key = localStorage.getItem('yiyan_api_key') || '';
    const saved_yiyan_api_secret = localStorage.getItem('yiyan_api_secret') || '';
    const saved_yiyan_model = localStorage.getItem('yiyan_model') || modelList[0]['name'];
    setYiyanStatus(saved_yiyan_status);
    form.setFieldValue("status", saved_yiyan_status);
    form.setFieldValue("apikey", saved_yiyan_api_key);
    form.setFieldValue("apisecret", saved_yiyan_api_secret);
    form.setFieldValue("model", saved_yiyan_model);
  }, [form]);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const clearLocalSetting = () => {
    setYiyanStatus(false);
    localStorage.removeItem('yiyan_status');
    localStorage.removeItem('yiyan_api_key');
    localStorage.removeItem('yiyan_api_secret');
    localStorage.removeItem('yiyan_model');
    form.setFieldValue("status", false);
    form.setFieldValue("apikey", '');
    form.setFieldValue("apisecret", '');
    messageApi.success('清除本地设置成功');
    setIsModalOpen(false);
  };
  const onFinish = (values: FormValues) => {
    setYiyanStatus(values.status);
    localStorage.setItem('yiyan_status', String(values.status));
    localStorage.setItem('yiyan_api_key', values.apikey);
    localStorage.setItem('yiyan_api_secret', values.apisecret);
    localStorage.setItem('yiyan_model', values.model);

    const localSavedProvidersString = localStorage.getItem('localSavedProviders');
    let localSavedProviders = localSavedProvidersString ? JSON.parse(localSavedProvidersString) : []
    if (values.status) {
      localSavedProviders = addIfNotExists(localSavedProviders, 'yiyan')
    } else {
      localSavedProviders = removeIfExists(localSavedProviders, 'yiyan')
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
        {yiyanStatus ?
          <>
            <div className='w-2 h-2 bg-green-500 rounded m-2'></div>
            <span className='mr-4 text-sm'>已启用</span></>
          :
          <><div className='w-2 h-2 bg-gray-400 rounded m-2'></div>
            <span className='mr-4 text-sm'>未启用</span>
          </>}
        <Button className='text-xs mr-2' onClick={showModal}>设置</Button>
      </div>
      <Modal title="设置文心一言/百度千帆"
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
                href='https://k2swpw8zgf.feishu.cn/wiki/XWY0wh43qitPpfksWljcidBHnDn'
              >
                查看设置引导
              </Link>
              {/* <Button
                type="link"
                onClick={clearLocalSetting}
              >
                清除本地设置
              </Button> */}
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
            <Form.Item label="Secret Key" name='apisecret'>
              <Input />
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

export default YiyanSettings;
