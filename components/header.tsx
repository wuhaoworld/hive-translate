'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { Button, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { SettingOutlined, TranslationOutlined } from '@ant-design/icons';
import logo from '@/app/images/logo.svg';
export function Header() {
  const t = useTranslations('Common');
  const [currentLang, setCurrentLang] = useState('zh');

  useEffect(() => {
    // 从 cookie 中获取语言设置
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    // 获取浏览器语言
    const getBrowserLanguage = () => {
      const lang = navigator.language.toLowerCase();
      if (lang.startsWith('zh')) return 'zh';
      if (lang.startsWith('ja')) return 'ja';
      return 'en'; // 默认返回英文
    };

    // 设置当前语言
    const savedLang = getCookie('language');
    if (savedLang && ['zh', 'en', 'ja'].includes(savedLang)) {
      setCurrentLang(savedLang);
    } else {
      const browserLang = getBrowserLanguage();
      setCurrentLang(browserLang);
      document.cookie = `language=${browserLang}; path=/`;
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-14 px-4 border-b bg-white shrink-0 backdrop-blur-xl">
      <div className="flex items-center">
        <h1 className='inline-flex'>
          <Link className='inline-flex' href="/">
            <Image src={logo} className='w-6 h-6' alt="Logo" />
            <span className='ml-2 font-sans'>Hive Translate</span>
          </Link>
        </h1>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Select
          prefix={<TranslationOutlined style={{'color':'#666'}} />}
          value={currentLang}
          onChange={(value) => {
            document.cookie = `language=${value}; path=/`;
            window.location.reload();
          }}
          options={[
            { value: 'zh', label: '中文' },
            { value: 'en', label: 'English' },
            { value: 'ja', label: '日本語' },
          ]}
        />
        <Link href={'/settings/providers'}>
          <Button icon={<SettingOutlined />}>{t('settings')}</Button>
        </Link>
      </div>
    </header>
  )
}