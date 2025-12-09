module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/app/print/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
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
            if (type === 'b') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: acc
            }, text, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 15,
                columnNumber: 38
            }, ("TURBOPACK compile-time value", void 0));
            if (type === 'i') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                children: acc
            }, text, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 16,
                columnNumber: 38
            }, ("TURBOPACK compile-time value", void 0));
            if (type === 'a') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
    const containerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const contentRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useLayoutEffect(()=>{
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
    }, [
        children
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "flex-1 overflow-hidden w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintBlockRenderer, {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-4 mt-6 font-yisunshin text-[#05121C]",
                children: getText(block.value)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 75,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'sub_header':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-xl font-bold mb-3 mt-4 font-yisunshin text-[#05121C]",
                children: getText(block.value)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 77,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'sub_sub_header':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-bold mb-2 mt-3 font-yisunshin text-gray-700",
                children: getText(block.value)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 79,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'text':
            const text = getText(block.value);
            if (!text) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4"
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 82,
                columnNumber: 31
            }, ("TURBOPACK compile-time value", void 0));
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm leading-relaxed mb-2 font-pretendard text-[#05121C] text-justify",
                children: text
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 83,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'bulleted_list':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "text-sm leading-relaxed mb-1 font-pretendard ml-4 list-disc text-[#05121C]",
                children: [
                    getText(block.value),
                    children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "text-sm leading-relaxed mb-1 font-pretendard ml-4 list-decimal text-[#05121C]",
                children: [
                    getText(block.value),
                    children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-6 my-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${ratio.left} min-w-0`,
                            children: blockMap[cols[0]] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintBlockRenderer, {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${ratio.right} min-w-0`,
                            children: blockMap[cols[1]] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintBlockRenderer, {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-6 my-2",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 107,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'column':
            // Fallback for non-special columns
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 110,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'divider':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                className: "border-gray-300 my-4"
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 112,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'quote':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                className: "pl-4 py-2 my-4 text-[10px] font-pretendard bg-[#F4F3EF] leading-relaxed break-words",
                children: getText(block.value)
            }, void 0, false, {
                fileName: "[project]/src/app/print/page.jsx",
                lineNumber: 114,
                columnNumber: 20
            }, ("TURBOPACK compile-time value", void 0));
        case 'callout':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 my-3 bg-[#F4F3EF] rounded border border-gray-200 text-[10px] flex gap-2 font-pretendard",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0",
                        children: block.value.format?.page_icon
                    }, void 0, false, {
                        fileName: "[project]/src/app/print/page.jsx",
                        lineNumber: 116,
                        columnNumber: 129
                    }, ("TURBOPACK compile-time value", void 0)),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
// A5 Page Component with Auto-fit
const Page = ({ pageNumber, children, className = "" })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-[148mm] h-[210mm] bg-white text-[#05121C] p-8 relative overflow-hidden flex flex-col ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AutoFitContent, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
// A4 Sheet Component
const Sheet = ({ leftPage, rightPage })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PrintBlockRenderer, {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-200 print:bg-white p-8 print:p-0 flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sheet, {
                leftPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 8,
                    className: "border-r border-dashed border-gray-200",
                    children: renderBlocks(content1.slice(15, 17), map1)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 184,
                    columnNumber: 27
                }, void 0),
                rightPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sheet, {
                leftPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 2,
                    className: "border-r border-dashed border-gray-200",
                    children: renderBlocks(content1.slice(3, 6), map1)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 192,
                    columnNumber: 27
                }, void 0),
                rightPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sheet, {
                leftPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 6,
                    className: "border-r border-dashed border-gray-200",
                    children: renderBlocks(content1.slice(9, 12), map1, ratio31)
                }, void 0, false, {
                    fileName: "[project]/src/app/print/page.jsx",
                    lineNumber: 198,
                    columnNumber: 27
                }, void 0),
                rightPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sheet, {
                leftPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
                    pageNumber: 4,
                    className: "border-r border-dashed border-gray-200",
                    children: [
                        title2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
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
                rightPage: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Page, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
const __TURBOPACK__default__export__ = PrintPage;
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__02483d1c._.js.map