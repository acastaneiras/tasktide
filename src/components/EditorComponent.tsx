"use client";

import { BlockTypeSelect, BoldItalicUnderlineToggles, CodeToggle, InsertThematicBreak, ListsToggle, MDXEditor, MDXEditorMethods, Separator, StrikeThroughSupSubToggles, UndoRedo, headingsPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';
import { useTheme } from "next-themes";
import { FC } from "react";

interface EditorProps {
    markdown: string;
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
    onChange?: (value: string) => void;
}

const Editor: FC<EditorProps> = ({ markdown, editorRef, onChange }) => {
    const { theme } = useTheme()
    return (
        <MDXEditor
            className={theme === 'dark' ? 'dark-theme dark-editor' : ''}
            onChange={onChange}
            contentEditableClassName='prose'
            ref={editorRef}
            markdown={markdown}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <div className='w-full max-w-full sm:max-w-max flex h-full overflow-x-auto text-primary hover:bg-primary/10'>
                            <UndoRedo />
                            <Separator className="border-secondary" />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <StrikeThroughSupSubToggles />
                            <InsertThematicBreak />
                            <ListsToggle />
                        </div>
                    )
                })
            ]}
        />
    );
};

export default Editor;
