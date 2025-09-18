import DOMPurify from 'dompurify';
import { useState } from 'react';

// THAY ĐỔI 1: Thêm callback onContentPlainTextDetected
interface PasteOptions {
  onTitleDetected?: (title: string) => void;
  onContentDetected?: (content: string) => void; // Trả về content dạng HTML
  onContentPlainTextDetected?: (plainText: string) => void; // Trả về content dạng plain text
  titleMaxLength?: number;
  autoFocus?: boolean;
}

// THAY ĐỔI 2: Thêm plainTextContent vào kết quả trả về
interface TitleContentResult {
  title: string;
  content: string; // Content dạng HTML
  plainTextContent: string; // Content dạng plain text
}

// Hook để xử lý smart paste
export const useSmartPaste = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // State này vẫn lưu HTML

  // Hàm phát hiện title từ text được paste (cập nhật để trả về cả plain text)
  const detectTitleFromText = (text: string): TitleContentResult => {
    const lines = text
      .trim()
      .split('\n')
      .filter((line: string) => line.trim());

    if (lines.length === 0) return { title: '', content: '', plainTextContent: '' };
    if (lines.length === 1) return { title: lines[0], content: '', plainTextContent: '' };

    const firstLine = lines[0].trim();
    const restContent = lines.slice(1).join('\n').trim();

    const isTitleCandidate = (line: string): boolean => {
      if (line.length > 200) return false;
      if (line.endsWith('.') && line.length > 50) return false;
      const titlePattern = /^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸᴴĐ]/;
      if (titlePattern.test(line)) return true;
      const upperCaseRatio = (line.match(/[A-Z]/g) || []).length / line.length;
      if (upperCaseRatio > 0.3) return true;
      if (/^\d+[\.\)\:]/.test(line)) return true;
      return true;
    };

    if (isTitleCandidate(firstLine)) {
      return {
        title: firstLine,
        content: restContent.replace(/\n/g, '<br />'),
        plainTextContent: restContent, // Trả về plain text gốc
      };
    } else {
      return {
        title: '',
        content: text.replace(/\n/g, '<br />'),
        plainTextContent: text, // Trả về plain text gốc
      };
    }
  };

  // Hàm xử lý paste từ HTML (cập nhật để trả về cả plain text)
  const detectTitleFromHTML = (html: string): TitleContentResult => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const getSanitizedContent = (body: HTMLElement): string => {
      // Chuẩn hóa thẻ img để tương thích với TipTap Image extension
      const images = body.querySelectorAll('img');
      images.forEach((img) => {
        // Chuyển đổi w, h thành width, height
        const w = img.getAttribute('w');
        const h = img.getAttribute('h');

        if (w) {
          img.setAttribute('width', w);
          img.removeAttribute('w');
        }
        if (h) {
          img.setAttribute('height', h);
          img.removeAttribute('h');
        }

        // Xóa các thuộc tính không cần thiết có thể gây conflict
        const unnecessaryAttrs = [
          'data-author',
          'photoid',
          'data-original',
          'rel',
          'type',
          'loading',
          'data-adbro-processed',
          'class',
          'id',
        ];

        unnecessaryAttrs.forEach((attr) => {
          img.removeAttribute(attr);
        });

        // Set thuộc tính theo format TipTap yêu cầu
        img.setAttribute('height', 'auto');
        img.setAttribute('style', '');
        img.setAttribute('flipx', 'false');
        img.setAttribute('flipy', 'false');
        img.setAttribute('align', 'center');
        img.setAttribute('inline', 'false');

        // Đảm bảo có alt text
        if (!img.getAttribute('alt')) {
          img.setAttribute('alt', 'Pasted image');
        }

        // Wrap img trong div với class="image" để TipTap nhận diện đúng
        if (!img.parentElement || !img.parentElement.classList.contains('image')) {
          const wrapper = document.createElement('div');
          wrapper.style.textAlign = 'center';
          wrapper.className = 'image';

          // Insert wrapper trước img và move img vào wrapper
          img.parentNode?.insertBefore(wrapper, img);
          wrapper.appendChild(img);
        }
      });

      // Sanitize với DOMPurify để bảo mật
      const sanitizedHTML = DOMPurify.sanitize(body.innerHTML, {
        ADD_TAGS: ['img', 'div', 'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'span', 'a'],
        ADD_ATTR: [
          'src',
          'alt',
          'title',
          'width',
          'height',
          'style',
          'class',
          'flipx',
          'flipy',
          'align',
          'inline',
          'href',
          'target',
        ],
        ALLOWED_URI_REGEXP: /^https?:\/\//i, // Chỉ cho phép HTTP/HTTPS URLs
        ALLOW_DATA_ATTR: false, // Chặn data-* attributes để bảo mật
        KEEP_CONTENT: true,
      });

      return sanitizedHTML;
    };

    // Tìm title từ các thẻ heading
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      const heading = headings[0];
      const title = heading.textContent?.trim() || '';

      // Bảo vệ các thẻ img trong heading bằng cách di chuyển chúng ra ngoài
      const imagesInHeading = heading.querySelectorAll('img');

      if (imagesInHeading.length > 0) {
        // Di chuyển tất cả img từ heading ra sau heading
        imagesInHeading.forEach((img) => {
          heading.parentNode?.insertBefore(img, heading.nextSibling);
        });
      }

      heading.remove();

      const content = getSanitizedContent(doc.body);
      const plainTextContent = doc.body.textContent?.trim() || ''; // Lấy plain text sau khi xóa title
      return { title, content, plainTextContent };
    }

    // Tìm title từ thẻ title
    const titleElement = doc.querySelector('title');
    if (titleElement) {
      const title = titleElement.textContent?.trim() || '';
      const content = getSanitizedContent(doc.body);
      const plainTextContent = doc.body.textContent?.trim() || '';
      return { title, content, plainTextContent };
    }

    // Tìm title từ các thẻ có style đặc biệt
    const styledElements = doc.querySelectorAll('[style*="font-weight: bold"], [style*="font-size"], strong, b');
    if (styledElements.length > 0) {
      const firstStyled = styledElements[0];
      const potentialTitle = firstStyled.textContent?.trim() || '';
      if (potentialTitle.length < 200 && !potentialTitle.includes('\n')) {
        // Bảo vệ các thẻ img trong styled elements
        const imagesInStyled = firstStyled.querySelectorAll('img');

        if (imagesInStyled.length > 0) {
          // Di chuyển tất cả img từ styled element ra sau element đó
          imagesInStyled.forEach((img) => {
            firstStyled.parentNode?.insertBefore(img, firstStyled.nextSibling);
          });
        }

        firstStyled.remove();

        const content = getSanitizedContent(doc.body);
        const plainTextContent = doc.body.textContent?.trim() || ''; // Lấy plain text sau khi xóa title
        return { title: potentialTitle, content, plainTextContent };
      }
    }

    // Fallback về text parsing
    return detectTitleFromText(doc.body.textContent || '');
  };

  // Handler chính cho sự kiện paste
  const handlePaste = (e: React.ClipboardEvent, options: PasteOptions = {}) => {
    e.preventDefault();

    // THAY ĐỔI 3: Destructure callback mới
    const {
      onTitleDetected = () => {},
      onContentDetected = () => {},
      onContentPlainTextDetected = () => {},
      titleMaxLength = 200,
    } = options;

    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    let result: TitleContentResult = { title: '', content: '', plainTextContent: '' };

    if (htmlData) {
      result = detectTitleFromHTML(htmlData);
    } else if (textData) {
      result = detectTitleFromText(textData);
    } else {
      return;
    }

    if (result.title.length > titleMaxLength) {
      // Gộp title quá dài vào cả content HTML và plain text
      result.content = `<p>${result.title}</p>${result.content}`;
      result.plainTextContent = result.title + '\n' + result.plainTextContent;
      result.title = '';
    }

    setTitle(result.title);
    setContent(result.content);

    // THAY ĐỔI 4: Gọi callback mới với dữ liệu plain text
    onTitleDetected(result.title);
    onContentDetected(result.content);
    onContentPlainTextDetected(result.plainTextContent);
  };

  return {
    title,
    content,
    setTitle,
    setContent,
    handlePaste,
  };
};
