import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { translate } from './utils';
import { Button, Skeleton, Collapse, theme, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import yiyanLogo from '@/app/images/providers/yiyan.svg';
import { modelList } from './models';
import {useTranslations} from 'next-intl';

const YiyanTranslater = forwardRef((props, ref) => {
  const t = useTranslations('HomePage');
  const [copyNotice, setCopyNotice] = useState(t('copy'));
  const [activeKey, setActiveKey] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [resultStatus, setResultStatus] = useState('init');
  const [savedModel, setSavedModel] = useState(modelList[0]);
  const { token } = theme.useToken();

  useImperativeHandle(ref, () => ({
    startTranslate: (from: string, to: string, text: string, finishCallback: () => {}) => {
      const apikey = localStorage.getItem('yiyan_api_key') || '';
      const model = localStorage.getItem('yiyan_model') || 'ERNIE-Speed';
      setActiveKey('yiyan');
      if (apikey === '') {
        setResultStatus('need_api_key');
        finishCallback();
        return;
      }
      setResultStatus('loading');
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
    const saved_yiyan_model = localStorage.getItem('yiyan_model') || modelList[0]['name'];
    const curretnModel = modelList.filter(item => item.name === saved_yiyan_model)
    if(curretnModel.length>0){
      setSavedModel(curretnModel[0])
    }
  }, []);

  const panelStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${token.colorBorder}`,
  };

  const contentFooter = <div className='flex flex-row-reverse text-md text-gray-400'>
  <CopyToClipboard text={translatedText} onCopy={() => {
    setCopyNotice(t('copied'));
    setTimeout(() => {
      setCopyNotice(t('copy'));
    }, 2000);
  }}>
    <Tooltip title={copyNotice}>
      <CopyOutlined className='cursor-pointer hover:bg-slate-100 rounded-md p-2' />
    </Tooltip>
  </CopyToClipboard>
</div>;
  function ChildrenDisplay(status: string) {
    switch (status) {
      case 'init':
        return <><p className='-mt-4 text-gray-400' >{t('resultPlaceholder')}</p>{contentFooter}</>;
      case 'need_api_key':
        return <><div>{t('please')} <Link href='/settings/providers'><Button type='link' style={{ padding: '0' }}> {t('config')} </Button></Link> API Key </div>{contentFooter}</>;
      case 'loading':
        return <><Skeleton.Input style={{ width: '100%', height: '18px' }} active />{contentFooter}</>;
      case 'done':
        return <><div className='-mt-4 translate-result'><Markdown remarkPlugins={[remarkGfm]}>{translatedText}</Markdown></div>{contentFooter}</>;
      default:
        return <><p className='-mt-4 text-gray-400' >{t('resultPlaceholder')}</p>{contentFooter}</>;
    }
  }

  const label = <div className='flex flex-row items-center'>
    <Image src={yiyanLogo} className='border rounded-full p-1 mr-2' width={26} height={26} alt='a' />
    <span>百度千帆/文心一言</span>
    {savedModel.displayName==='' ? '' : <span className='text-gray-400 ml-2'>({savedModel.displayName})</span>}
  </div>;
  
  const yiyanItems = [
    {
      key: 'yiyan',
      label: label,
      children: ChildrenDisplay(resultStatus),
      style: panelStyle,
    }
  ];

  return (
    <Collapse
      ghost
      key='yiyan'
      className='w-full'
      bordered={false}
      defaultActiveKey={[]}
      activeKey={activeKey}
      expandIconPosition='end'
      items={yiyanItems}
      onChange={() => {
        if (activeKey === 'yiyan') {
          setActiveKey('')
        } else {
          setActiveKey('yiyan')
        }
      }}
    />
  )
});

YiyanTranslater.displayName = 'YiyanTranslater';

export default YiyanTranslater