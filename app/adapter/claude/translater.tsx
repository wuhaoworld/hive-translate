import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import { LLMModel } from "@/app/adapter/interface"
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import claudeLogo from './claude_logo.svg';
import { translate } from './utils';
import { Button, Skeleton, Collapse, theme, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import { modelList } from './models';

const ClaudeTranslater = forwardRef((props, ref) => {
  const [copyNotice, setCopyNotice] = useState('复制');
  const [activeKey, setActiveKey] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [resultStatus, setResultStatus] = useState('init');
  const [savedModel, setSavedModel] = useState(modelList[0]);
  const { token } = theme.useToken();

  useImperativeHandle(ref, () => ({
    startTranslate: (from: string, to: string, text: string, finishCallback: () => {}) => {
      const apikey = localStorage.getItem('claude_api_key') || '';
      const model = localStorage.getItem('claude_model') || 'claude-3-5-sonnet-20240620';
      if (apikey === '') {
        setResultStatus('need_api_key');
        setActiveKey('claude');
        finishCallback();
        return;
      }
      setResultStatus('loading');
      setActiveKey('claude');
      setTranslatedText('');
      translate(
        from,
        to,
        text,
        model,
        (message: string) => {
          setTranslatedText(message);
          setResultStatus('done');
        },
        finishCallback
      )
    }
  }));

  useEffect(() => {
    const saved_clude_model = localStorage.getItem('claude_model') || modelList[0]['name'];
    const curretnModel = modelList.filter(item => item.name === saved_clude_model);
    if(curretnModel.length>0){
      setSavedModel(curretnModel[0])
    }
  }, []);

  const panelStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${token.colorBorder}`,
  };
  function ChildrenDisplay(status: string) {
    switch (status) {
      case 'init':
        return <><p className='-mt-4 text-gray-400' >翻译结果将展示在这里</p>{contentFooter}</>;
      case 'need_api_key':
        return <><div>请先<Link href='/settings/providers' passHref legacyBehavior><Button type='link' className='w-2'> 设置 </Button></Link> API Key </div>{contentFooter}</>;
      case 'loading':
        return <><Skeleton.Input style={{ width: '100%', height: '18px' }} active />{contentFooter}</>;
      case 'done':
        return <><div className='-mt-4 translate-result'><Markdown remarkPlugins={[remarkGfm]}>{translatedText}</Markdown></div>{contentFooter}</>;
      default:
        return <><p className='-mt-4 text-gray-400' >翻译结果将展示在这里</p>{contentFooter}</>;
    }
  }

  const contentFooter = <div className='flex flex-row-reverse text-md text-gray-400'>
    <CopyToClipboard text={translatedText} onCopy={() => {
      setCopyNotice('已复制');
      setTimeout(() => {
        setCopyNotice('复制');
      }, 2000);
    }}>
      <Tooltip title={copyNotice}>
        <CopyOutlined className='cursor-pointer hover:bg-slate-100 rounded-md p-2' />
      </Tooltip>
    </CopyToClipboard>
  </div>;
  const label = <div className='flex flex-row items-center'>
    <Image src={claudeLogo} className='border rounded-full p-1 mr-2' width={26} height={26} alt='a' />
    <span>Claude</span>
    {<span className='text-gray-400 ml-2'>({savedModel.displayName})</span>}
  </div>;
  const claudeItems = [
    {
      key: 'claude',
      label: label,
      children: ChildrenDisplay(resultStatus),
      style: panelStyle,
    }
  ];

  return (
    <Collapse
      ghost
      key='claude'
      className='w-full'
      bordered={false}
      defaultActiveKey={[]}
      activeKey={activeKey}
      expandIconPosition='end'
      items={claudeItems}
      onChange={() => {
        if (activeKey === 'claude') {
          setActiveKey('')
        } else {
          setActiveKey('claude')
        }
      }}
    />
  )
});

ClaudeTranslater.displayName = 'ClaudeTranslater';

export default ClaudeTranslater