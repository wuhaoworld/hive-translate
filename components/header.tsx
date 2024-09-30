import Image from 'next/image';
import Link from 'next/link'
import { Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import logo from '@/app/images/logo.svg';
export function Header() {
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
        <Link href={'/settings/providers'}>
          <Button icon={<SettingOutlined />}>设置</Button>
        </Link>
      </div>
    </header>
  )
}