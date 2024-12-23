import { BoldItalicUnderlineToggles, CodeToggle, InsertThematicBreak, ListsToggle, MDXEditor, MDXEditorMethods, Separator, StrikeThroughSupSubToggles, UndoRedo, headingsPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";

interface EditorProps {
    markdown: string;
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
    onChange?: (value: string) => void;
}

const Editor: FC<EditorProps> = ({ markdown, editorRef, onChange }) => {
    const { theme, systemTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<string>("light");

    useEffect(() => {
        if (theme === "system") {
            setCurrentTheme(systemTheme === "dark" ? "dark" : "light");
        } else {
            setCurrentTheme(theme === "dark" ? "dark" : "light");
        }
    }, [theme, systemTheme]);

    return (
        <MDXEditor
            className={currentTheme === 'dark' ? 'dark-theme dark-editor' : ''}
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
                        <div className="w-full">
                            <div className="flex flex-wrap items-center space-x-2 overflow-x-auto">
                                <UndoRedo />
                                <Separator className="border-secondary" />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <StrikeThroughSupSubToggles />
                                <InsertThematicBreak />
                                <ListsToggle />
                            </div>
                        </div>
                    )
                })
            ]}
        />
    );
};

export default Editor;
