'use client';

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

import YooptaEditor, {
  createYooptaEditor,
  SlateElement,
  YooptaContentValue,
  YooptaOnChangeOptions,
  YooptaPlugin,
} from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from '@yoopta/marks';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, {
  DefaultActionMenuRender,
} from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import './style.css';

const uploadToCloudinary = async (file: File, resourceType: string) => {
  return {
    secure_url: URL.createObjectURL(file),
    width: 300,
    height: 200,
    format: file.type,
    name: file.name,
    bytes: file.size,
  };
};

const plugins = [
  Paragraph,
  Table,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: '#007aff',
      }),
    },
  }),
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image.extend({
    options: {
      async onUpload(file: File) {
        const data = await uploadToCloudinary(file, 'image');
        return {
          src: data.secure_url,
          alt: 'uploaded image',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
    },
  }),
  Video.extend({
    options: {
      onUpload: async (file: File) => {
        const data = await uploadToCloudinary(file, 'video');
        return {
          src: data.secure_url,
          alt: 'uploaded video',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
      onUploadPoster: async (file: File) => {
        const image = await uploadToCloudinary(file, 'image');
        return image.secure_url;
      },
    },
  }),
  File.extend({
    options: {
      onUpload: async (file: File) => {
        const response = await uploadToCloudinary(file, 'auto');
        return {
          src: response.secure_url,
          format: response.format,
          name: response.name,
          size: response.bytes,
        };
      },
    },
  }),
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

interface TopicNode2Props {
  value: YooptaContentValue;
  onChange: (
    newValue: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => void;
  readOnly: boolean;
}

const TopicContentEditor: React.FC<TopicNode2Props> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const pathname = usePathname();
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<YooptaContentValue>(value);

  useEffect(() => {
    lastValueRef.current = value;
  }, [value]);

  useEffect(() => {
    editor.insertBlock('Paragraph', { at: 1, focus: true });
  }, []);

  const internalOnChange = useCallback(
    (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
      if (
        selectionRef.current &&
        !selectionRef.current.contains(document.activeElement)
      ) {
        return;
      }
      if (JSON.stringify(lastValueRef.current) === JSON.stringify(newValue)) {
        return;
      }
      lastValueRef.current = newValue;
      onChange(newValue, options);
    },
    [onChange]
  );

  const containerClass = pathname.includes('roadmap-viewer')
    ? 'md:px-1 flex justify-center'
    : 'md:px-36 flex justify-center';

  return (
    <div className={containerClass} ref={selectionRef} tabIndex={0}>
      <YooptaEditor
        editor={editor}
        plugins={
          plugins as unknown as Readonly<
            YooptaPlugin<Record<string, SlateElement>>[]
          >
        }
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={value}
        onChange={internalOnChange}
        style={{ width: '100%' }}
        autoFocus
        readOnly={readOnly}
      />
    </div>
  );
};

export default TopicContentEditor;
