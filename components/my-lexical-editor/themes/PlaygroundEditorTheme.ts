/**
 * Lexical Editor Theme — Pure Tailwind CSS
 * Không cần import file CSS riêng nữa.
 *
 * Lưu ý: Một số class dùng Tailwind arbitrary values [...]
 * Nếu dùng Tailwind v3 với JIT thì hoạt động bình thường.
 */

import type { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
  // --- Autocomplete ---
  autocomplete: 'text-[#ccc]',

  // --- Block cursor ---
  // Thay PlaygroundEditorTheme__blockCursor:
  // ::after pseudo-element không làm được bằng Tailwind thuần,
  // nhưng phần layout/position thì được.
  blockCursor: 'block pointer-events-none absolute w-[1px] h-5 bg-black top-0 -translate-x-px',

  // --- Character limit highlight ---
  characterLimit: 'inline !bg-[#ffbbbb]',

  // --- Code block ---
  code: [
    'bg-[rgb(240,242,245)] font-mono block leading-[1.53] text-[13px]',
    'pt-2 m-0 mt-2 mb-2 overflow-x-auto relative whitespace-pre max-w-full box-border',
    // counter cho line numbers (cần CSS thuần — xem ghi chú bên dưới)
    // Nếu muốn bỏ line numbers, bỏ 2 class cuối đây đi
    '[counter-reset:code-line] before:content-[""] after:content-[""]',
  ].join(' '),

  // --- Code syntax highlighting ---
  codeHighlight: {
    atrule: 'text-[#07a]',
    attr: 'text-[#07a]',
    boolean: 'text-[#905]',
    builtin: 'text-[#690]',
    cdata: 'text-slate-400',
    char: 'text-[#690]',
    class: 'text-[#dd4a68]',
    'class-name': 'text-[#dd4a68]',
    comment: 'text-slate-400',
    constant: 'text-[#905]',
    // deleted / inserted dùng text-decoration không map được hoàn toàn bằng Tailwind
    // nhưng có thể dùng arbitrary properties
    deleted: 'text-red-500 [text-decoration:line-through]',
    doctype: 'text-slate-400',
    entity: 'text-[#9a6e3a]',
    function: 'text-[#dd4a68]',
    important: 'text-[#e90] font-bold',
    inserted: 'text-[#690] underline',
    keyword: 'text-[#07a]',
    namespace: 'text-[#e90] opacity-70',
    number: 'text-[#905]',
    operator: 'text-[#9a6e3a]',
    prolog: 'text-slate-400',
    property: 'text-[#905]',
    punctuation: 'text-[#999]',
    regex: 'text-[#e90]',
    selector: 'text-[#690]',
    string: 'text-[#690]',
    symbol: 'text-[#905]',
    tag: 'text-[#905]',
    // unchanged — thường không cần style đặc biệt
    unchanged: '',
    url: 'text-[#9a6e3a] underline',
    variable: 'text-[#e90]',
  },

  // --- Embed block ---
  embedBlock: {
    base: 'select-none',
    focus: 'outline outline-2 outline-[rgb(60,132,244)]',
  },

  // --- Hashtag ---
  hashtag: 'bg-[rgba(88,144,255,0.15)] [border-bottom:1px_solid_rgba(88,144,255,0.3)]',

  // --- Headings ---
  heading: {
    h1: 'text-2xl text-[rgb(5,5,5)] font-bold m-0',
    h2: 'text-[15px] text-[rgb(101,103,107)] font-bold m-0 uppercase',
    h3: 'text-xs m-0 uppercase',
    h4: '',
    h5: '',
    h6: '',
  },

  // --- Horizontal rule ---
  // Thay PlaygroundEditorTheme__hr (thường có ::before / ::after cho visual line)
  hr: 'p-[2px] border-none my-[1em] cursor-pointer border-0 [border-top:1px_solid_rgb(206,208,212)] block',
  hrSelected: 'outline outline-2 outline-[rgb(60,132,244)] select-none',

  // --- Image ---
  image: 'max-w-full inline-block relative cursor-default',

  // --- Indent ---
  // Thay PlaygroundEditorTheme__indent (thường dùng --lexical-indent-base-value CSS var)
  indent: 'ml-[40px]',

  // --- Layout ---
  layoutContainer: 'grid gap-[10px] my-[10px]',
  layoutItem: 'border border-dashed border-[#ddd] p-[8px_16px] min-w-0 max-w-full',

  // --- Link ---
  link: 'text-[rgb(33,111,219)] no-underline hover:underline hover:cursor-pointer',

  // --- Lists ---
  list: {
    checklist: 'p-0 m-0 list-none',
    listitem: 'mx-8',
    listitemChecked:
      'relative mx-[0.5em] px-[1.5em] list-none outline-none block min-h-[1.5em] line-through cursor-pointer lexical-listitem-checked',
    listitemUnchecked:
      'relative mx-[0.5em] px-[1.5em] list-none outline-none block min-h-[1.5em] cursor-pointer lexical-listitem-unchecked',
    nested: {
      listitem: 'list-none before:hidden after:hidden',
    },
    olDepth: [
      'p-0 m-0 list-decimal list-outside',
      'p-0 m-0 list-[upper-alpha] list-outside',
      'p-0 m-0 list-[lower-alpha] list-outside',
      'p-0 m-0 list-[upper-roman] list-outside',
      'p-0 m-0 list-[lower-roman] list-outside',
    ],
    ul: 'p-0 m-0 list-disc list-outside',
  },

  // --- Mark (highlight) ---
  mark: 'bg-[rgba(255,212,0,0.14)] [border-bottom:2px_solid_rgba(255,212,0,0.3)] pb-[2px]',
  markOverlap: 'bg-[rgba(255,212,0,0.3)] [border-bottom:2px_solid_rgba(255,212,0,0.7)]',

  // --- Paragraph ---
  paragraph: 'm-0 relative',

  // --- Blockquote ---
  quote: 'm-0 ml-5 mb-[10px] text-[15px] text-[rgb(101,103,107)] border-l-4 border-l-[rgb(206,208,212)] pl-4',

  // --- Special text ---
  specialText: 'bg-yellow-300 font-bold',

  // --- Tab node ---
  tab: 'relative no-underline',

  // --- Tables ---
  table: 'border-collapse overflow-y-scroll overflow-x-scroll table-fixed w-fit mt-[25px] mb-[30px]',
  tableAddColumns: 'absolute bg-[#eee] h-full border-0 cursor-pointer hover:bg-[#c9dbf0] top-0 w-[25px] right-[-25px]',
  tableAddRows:
    'absolute w-[calc(100%-25px)] bg-[#eee] border-0 cursor-pointer hover:bg-[#c9dbf0] left-0 bottom-[-25px] h-[25px]',
  tableAlignment: {
    center: 'mx-auto',
    right: 'ml-auto',
  },
  tableCell: 'border border-[#bbb] w-[75px] align-top text-left p-[6px_8px] relative outline-none overflow-auto',
  tableCellActionButton: 'bg-[#eee] block border-0 rounded-[20px] w-5 h-5 text-[#222] cursor-pointer hover:bg-[#ddd]',
  tableCellActionButtonContainer: 'block right-[5px] top-[6px] absolute z-[4] w-5 h-5',
  tableCellHeader: 'bg-[#f2f3f5] text-left',
  tableCellResizer: 'absolute -right-1 h-full w-2 cursor-ew-resize z-10 top-0',
  // caret-transparent đã là Tailwind
  tableCellSelected: 'caret-transparent bg-[rgba(60,132,244,0.15)]',
  // frozen column / row cần sticky + box-shadow, dùng arbitrary
  tableFrozenColumn: 'sticky left-0 z-[2] [box-shadow:2px_0_4px_rgba(0,0,0,0.15)] bg-white',
  tableFrozenRow: 'sticky top-0 z-[3] [box-shadow:0_2px_4px_rgba(0,0,0,0.15)] bg-white',
  // striping dùng nth-child — không làm được bằng Tailwind utility, cần CSS hoặc JS
  // Để trống hoặc dùng class CSS riêng nếu cần
  tableRowStriping: '[&:nth-child(even)>td]:bg-[#f8f8f8]',
  tableScrollableWrapper: 'overflow-x-auto mb-[5px]',
  tableSelected: 'outline outline-2 outline-[rgb(60,132,244)]',
  tableSelection: 'bg-[rgba(60,132,244,0.08)]',

  // --- Inline text formats ---
  text: {
    bold: 'font-bold',
    capitalize: 'capitalize',
    code: 'bg-[rgb(240,242,245)] px-1 py-px font-mono text-[94%]',
    highlight: '[background:rgba(255,212,0,0.14)] [border-bottom:2px_solid_rgba(255,212,0,0.3)]',
    italic: 'italic',
    lowercase: 'lowercase',
    strikethrough: 'line-through',
    subscript: 'text-[0.8em] !align-sub',
    superscript: 'text-[0.8em] align-super',
    underline: 'underline',
    underlineStrikethrough: '[text-decoration:underline_line-through]',
    uppercase: 'uppercase',
  },
};

export default theme;
