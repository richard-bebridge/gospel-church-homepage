(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/print/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
// import printPart1Data from '../../data/printPart1.json';
// import printPart2Data from '../../data/printPart2.json';
// Helper to get block text (reused)
const getText = (block)=>{
    if (!block || !block.properties?.title) return null;
    return block.properties.title.map((item)=>{
        const [text, decorations] = item;
        if (!decorations) return text;
        return decorations.reduce((acc, deco)=>{
            const [type] = deco;
            if (type === 'b') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: acc
            }, text, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 15,
                columnNumber: 38
            }, ("TURBOPACK compile-time value", void 0));
            if (type === 'i') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                children: acc
            }, text, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 16,
                columnNumber: 38
            }, ("TURBOPACK compile-time value", void 0));
            if (type === 'a') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: deco[1],
                className: "underline text-blue-600",
                children: acc
            }, text, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 17,
                columnNumber: 38
            }, ("TURBOPACK compile-time value", void 0));
            return acc;
        }, text);
    });
};
// Auto-fit Wrapper Component
const AutoFitContent = ({ children })=>{
    _s();
    const containerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const contentRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useLayoutEffect({
        "AutoFitContent.useLayoutEffect": ()=>{
            const container = containerRef.current;
            const content = contentRef.current;
            if (!container || !content) return;
            // Reset scaling first
            content.style.transform = 'scale(1)';
            content.style.width = '100%';
            const containerHeight = container.clientHeight;
            const contentHeight = content.scrollHeight;
            if (contentHeight > containerHeight) {
                // Calculate scale needed to fit
                const scale = containerHeight / contentHeight;
                // Cap the scaling to avoid becoming too small (e.g., 0.7)
                const safeScale = Math.max(scale, 0.6);
                content.style.transformOrigin = 'top left';
                content.style.transform = `scale(${safeScale})`;
                content.style.width = `${1 / safeScale * 100}%`; // Increase width to compensate for scale
            }
        }
    }["AutoFitContent.useLayoutEffect"], [
        children
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "flex-1 overflow-hidden w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: contentRef,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/print/page.jsx",
            lineNumber: 54,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/print/page.jsx",
        lineNumber: 53,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AutoFitContent, "pVPD/v78eZRhgaveoJEQrXSQBLk=");
_c = AutoFitContent;
// Simple Block Renderer for Print with Site Design Language
const PrintBlockRenderer = ({ block, blockMap, ratio = {
    left: 'w-[67%]',
    right: 'w-[33%]'
} })=>{
    const type = block.value?.type;
    const content = block.value?.content;
    // Recursive rendering
    const children = content?.map((id)=>{
        const childBlock = blockMap[id];
        if (!childBlock) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintBlockRenderer, {
            block: childBlock,
            blockMap: blockMap,
            ratio: ratio
        }, id, false, {
            fileName: "[project]/src/app/print/page.jsx",
            lineNumber: 70,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0));
    });
    switch(type){
        case 'header':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-4 mt-6 font-yisunshin text-[#05121C]",
                children: getText(block.value)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 75,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'sub_header':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-xl font-bold mb-3 mt-4 font-yisunshin text-[#05121C]",
                children: getText(block.value)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 77,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'sub_sub_header':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-bold mb-2 mt-3 font-yisunshin text-gray-700",
                children: getText(block.value)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 79,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'text':
            const text = getText(block.value);
            if (!text) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4"
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 82,
                columnNumber: 31
            }, ("TURBOPACK compile-time value", void 0));
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm leading-relaxed mb-2 font-pretendard text-[#05121C] text-justify",
                children: text
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 83,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'bulleted_list':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "text-sm leading-relaxed mb-1 font-pretendard ml-4 list-disc text-[#05121C]",
                children: [
                    getText(block.value),
                    children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mt-1",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/app/print/page.jsx",
                        lineNumber: 85,
                        columnNumber: 146
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 85,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'numbered_list':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "text-sm leading-relaxed mb-1 font-pretendard ml-4 list-decimal text-[#05121C]",
                children: [
                    getText(block.value),
                    children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        className: "mt-1",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/app/print/page.jsx",
                        lineNumber: 87,
                        columnNumber: 149
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 87,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'image':
            const source = block.value?.properties?.source?.[0]?.[0];
            const imageUrl = `https://www.notion.so/image/${encodeURIComponent(source)}?table=block&id=${block.value.id}&cache=v2`;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: imageUrl,
                alt: "Print Image",
                className: "w-full h-auto my-4 rounded grayscale-0"
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 91,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'column_list':
            // Custom rendering for columns to enforce ratio if there are exactly 2 columns
            const cols = content || [];
            if (cols.length === 2) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-6 my-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${ratio.left} min-w-0`,
                            children: blockMap[cols[0]] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintBlockRenderer, {
                                block: blockMap[cols[0]],
                                blockMap: blockMap,
                                ratio: ratio
                            }, void 0, false, {
                                fileName: "[project]/src/app/print/page.jsx",
                                lineNumber: 99,
                                columnNumber: 51
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/print/page.jsx",
                            lineNumber: 98,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${ratio.right} min-w-0`,
                            children: blockMap[cols[1]] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintBlockRenderer, {
                                block: blockMap[cols[1]],
                                blockMap: blockMap,
                                ratio: ratio
                            }, void 0, false, {
                                fileName: "[project]/src/app/print/page.jsx",
                                lineNumber: 102,
                                columnNumber: 51
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/print/page.jsx",
                            lineNumber: 101,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 97,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0));
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-6 my-2",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 107,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'column':
            // Fallback for non-special columns
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 110,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'divider':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                className: "border-gray-300 my-4"
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 112,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'quote':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                className: "pl-4 py-2 my-4 text-[10px] font-pretendard bg-[#F4F3EF] leading-relaxed break-words",
                children: getText(block.value)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 114,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'callout':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 my-3 bg-[#F4F3EF] rounded border border-gray-200 text-[10px] flex gap-2 font-pretendard",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0",
                        children: block.value.format?.page_icon
                    }, void 0, false, {
                        fileName: "[project]/src/app/print/page.jsx",
                        lineNumber: 116,
                        columnNumber: 129
                    }, ("TURBOPACK compile-time value", void 0)),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: getText(block.value)
                    }, void 0, false, {
                        fileName: "[project]/src/app/print/page.jsx",
                        lineNumber: 116,
                        columnNumber: 193
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 116,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        default:
            return null;
    }
};
_c1 = PrintBlockRenderer;
// A5 Page Component with Auto-fit
const Page = ({ pageNumber, children, className = "" })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-[148mm] h-[210mm] bg-white text-[#05121C] p-8 relative overflow-hidden flex flex-col ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AutoFitContent, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "[&>*:first-child]:mt-0",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 128,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 127,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-6 left-0 right-0 text-center text-xs font-pretendard text-gray-400",
                children: [
                    "- ",
                    pageNumber,
                    " -"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 134,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/print/page.jsx",
        lineNumber: 125,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c2 = Page;
// A4 Sheet Component
const Sheet = ({ leftPage, rightPage })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-[297mm] h-[210mm] bg-white flex shadow-lg print:shadow-none mb-8 print:mb-0 print:break-after-page mx-auto",
        children: [
            leftPage,
            rightPage
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/print/page.jsx",
        lineNumber: 144,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = Sheet;
const PrintPage = ()=>{
    // Data Mapping
    // Part 1: Pages 1, 2, 3, 6, 7, 8
    // const map1 = printPart1Data.block;
    // const root1 = Object.values(map1).find(b => b.value.type === 'page')?.value;
    // const content1 = root1?.content || [];
    const map1 = {};
    const content1 = [];
    // Part 2: Pages 4, 5
    // const map2 = printPart2Data.block;
    // const root2 = Object.values(map2).find(b => b.value.type === 'page')?.value;
    // const content2 = root2?.content || [];
    // Ensure title is extracted from the page block value
    // const title2 = getText(root2) || root2?.properties?.title?.[0]?.[0];
    const map2 = {};
    const content2 = [];
    const title2 = "Print Page (Notion Integration Pending)";
    const renderBlocks = (ids, map, ratio)=>ids.map((id)=>{
            const block = map[id];
            if (!block) return null;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintBlockRenderer, {
                block: block,
                blockMap: map,
                ratio: ratio
            }, id, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 173,
                columnNumber: 16
            }, ("TURBOPACK compile-time value", void 0));
        });
    // Ratios
    const ratio21 = {
        left: 'w-[67%]',
        right: 'w-[33%]'
    }; // 2:1
    const ratio31 = {
        left: 'w-[75%]',
        right: 'w-[25%]'
    }; // 3:1
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-200 print:bg-white p-8 print:p-0 flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sheet, {
                leftPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 8,
                    className: "border-r border-dashed border-gray-200",
                    children: renderBlocks(content1.slice(15, 17), map1)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 184,
                    columnNumber: 27
                }, void 0),
                rightPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 1,
                    children: renderBlocks(content1.slice(0, 3), map1)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 185,
                    columnNumber: 28
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 183,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sheet, {
                leftPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 2,
                    className: "border-r border-dashed border-gray-200",
                    children: renderBlocks(content1.slice(3, 6), map1)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 192,
                    columnNumber: 27
                }, void 0),
                rightPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 7,
                    children: renderBlocks(content1.slice(12, 15), map1)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 193,
                    columnNumber: 28
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 191,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sheet, {
                leftPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 6,
                    className: "border-r border-dashed border-gray-200",
                    children: renderBlocks(content1.slice(9, 12), map1, ratio31)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 198,
                    columnNumber: 27
                }, void 0),
                rightPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 3,
                    children: renderBlocks(content1.slice(6, 9), map1, ratio31)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 199,
                    columnNumber: 28
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 197,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sheet, {
                leftPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 4,
                    className: "border-r border-dashed border-gray-200",
                    children: [
                        title2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold mb-6 font-yisunshin text-[#05121C] text-center break-keep",
                            children: title2
                        }, void 0, false, {
                            fileName: "[project]/src/app/print/page.jsx",
                            lineNumber: 205,
                            columnNumber: 32
                        }, void 0),
                        renderBlocks(content2.slice(0, 4), map2, ratio21)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 204,
                    columnNumber: 27
                }, void 0),
                rightPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 5,
                    children: renderBlocks(content2.slice(4), map2, ratio21)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 208,
                    columnNumber: 28
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 203,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "print:hidden fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg text-sm",
                children: "Press Cmd+P to Print (Landscape)"
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 211,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/print/page.jsx",
        lineNumber: 181,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = PrintPage;
const __TURBOPACK__default__export__ = PrintPage;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "AutoFitContent");
__turbopack_context__.k.register(_c1, "PrintBlockRenderer");
__turbopack_context__.k.register(_c2, "Page");
__turbopack_context__.k.register(_c3, "Sheet");
__turbopack_context__.k.register(_c4, "PrintPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_927a7723._.js.map