"use client"
// import React, { useState, useEffect } from 'react'
// import Image from 'next/image'
import MoonshotSettings from "@/app/adapter/moonshot/settings";
import OpenAiSettings from "@/app/adapter/openai/settings";
import YiyanSettings from "@/app/adapter/yiyan/settings";
import ClaudeSettings from "@/app/adapter/claude/settings";

export default function Component() {
  return (
    <>
      <div className="container flex flex-row justify-center">
        <div className='container max-w-3xl mb-6 px-4 md:px-0'>
          <h2 className="mt-6 scroll-m-20 pb-2 text-xl font-semibold tracking-tight transition-colors">
            模型设置
          </h2>
          <OpenAiSettings />
          <ClaudeSettings />
          <MoonshotSettings />
          <YiyanSettings />
        </div>
      </div>
    </>
  )
}
