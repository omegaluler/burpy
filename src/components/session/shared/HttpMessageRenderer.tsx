"use client";

import { SyntaxHighlighter } from "./SyntaxHighlighter";
import { useMessageFormatter } from "~/hooks/session/useMessageFormatter";

interface HttpMessageRendererProps {
    content: string;
    wrap: boolean;
    prettify: boolean;
    type: "request" | "response";
}

export function HttpMessageRenderer({
    content,
    wrap,
    prettify,
    type,
}: HttpMessageRendererProps) {
    const { formatMessage } = useMessageFormatter();
    const { headers, body, language } = formatMessage(content, {
        wrap,
        prettify,
    });

    const headerLines = headers.split("\n");
    const firstLine = headerLines[0];
    const otherHeaders = headerLines.slice(1).join("\n");

    return (
        <div className="font-mono" data-type={type}>
            {/* First line (HTTP method/status) */}
            <div className="py-4 px-4 border-b border-border">
                <SyntaxHighlighter
                    language="http"
                    content={firstLine}
                    wrap={wrap}
                    type={type}
                />
            </div>

            {/* Headers */}
            {otherHeaders && (
                <div className="px-4 py-2">
                    <SyntaxHighlighter
                        language="http"
                        content={otherHeaders}
                        wrap={wrap}
                        type={type}
                    />
                </div>
            )}

            {/* Body */}
            {body && (
                <>
                    <div className="border-t border-border" />
                    <div className="px-4 py-2">
                        <SyntaxHighlighter
                            language={language}
                            content={body}
                            wrap={wrap}
                            type={type}
                        />
                    </div>
                </>
            )}
        </div>
    );
}