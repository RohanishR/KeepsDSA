(function(){var e=!1;function t(){if(document.getElementById(`keepsdsa-sync-btn`)||e)return;let t=document.createElement(`button`);t.id=`keepsdsa-sync-btn`,t.innerHTML=`
    <svg xmlns="http://www.w3.org/20event0/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
    <span>Save to KeepsDSA</span>
  `,Object.assign(t.style,{position:`fixed`,bottom:`24px`,right:`24px`,backgroundColor:`#2563eb`,color:`#ffffff`,border:`none`,borderRadius:`8px`,padding:`12px 20px`,fontFamily:`system-ui, -apple-system, sans-serif`,fontSize:`14px`,fontWeight:`600`,display:`flex`,alignItems:`center`,gap:`8px`,cursor:`pointer`,boxShadow:`0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,zIndex:`999999`,transition:`all 0.2s ease`}),t.onmouseover=()=>{t.style.backgroundColor=`#1d4ed8`,t.style.transform=`translateY(-2px)`},t.onmouseout=()=>{t.style.backgroundColor=`#2563eb`,t.style.transform=`translateY(0)`},t.addEventListener(`click`,i),document.body.appendChild(t),e=!0}function n(){return new Promise(e=>{let t=`KeepsDSACode_`+Date.now(),n=document.createElement(`script`);n.textContent=`
      (function() {
        let code = '';
        try {
          // Try Monaco
          if (window.monaco && window.monaco.editor) {
            const models = window.monaco.editor.getModels();
            if (models.length > 0) code = models[0].getValue();
          } 
          // Try CodeMirror 6
          else {
            const cmContent = document.querySelector('.cm-content');
            if (cmContent && cmContent.cmView && cmContent.cmView.view) {
              code = cmContent.cmView.view.state.doc.toString();
            } else if (document.querySelector('.view-lines')) {
              // Fallback for monaco if window.monaco is hidden but we can access editor instance
              const editorNode = document.querySelector('.monaco-editor');
              // Not easily accessible without window.monaco
            }
          }
        } catch(e) {}
        document.dispatchEvent(new CustomEvent('${t}', { detail: code }));
      })();
    `;let r=i=>{document.removeEventListener(t,r),n.remove(),e(i.detail||``)};document.addEventListener(t,r),document.documentElement.appendChild(n),setTimeout(()=>{document.removeEventListener(t,r),n.parentNode&&n.remove(),e(``)},1500)})}async function r(){let e=window.location.href,t=e.match(/problems\/([^\/]+)/),r=t?t[1]:null;if(!r)throw Error(`Could not extract problem slug from URL`);let i=r.split(`-`).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(` `),a=document.querySelector(`h1`)||document.querySelector(`[data-cy="question-title"]`),o=a?.textContent?a.textContent.replace(/^\d+\.\s*/,``):i,s=document.querySelector(`[data-track-load="description_content"]`),c=s?s.innerHTML:``,l=document.querySelector(`.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard`),u=l?l.textContent:`Medium`,d=document.querySelectorAll(`a[href^="/tag/"]`),f=[];d.forEach(e=>{e.textContent&&f.push(e.textContent)});let p=await n();if(!p){let e=document.querySelectorAll(`.cm-line`);if(e.length>0)p=Array.from(e).map(e=>(e.textContent||``).replace(/\u00a0/g,` `)).join(`
`);else{let e=document.querySelectorAll(`.view-lines .view-line`);if(e.length>0)p=Array.from(e).sort((e,t)=>parseInt(e.style.top||`0`,10)-parseInt(t.style.top||`0`,10)).map(e=>(e.textContent||``).replace(/\u00a0/g,` `)).join(`
`);else{let e=document.querySelectorAll(`pre`);for(let t=e.length-1;t>=0;t--)if(e[t].textContent&&e[t].textContent.length>20){p=e[t].textContent||``;break}}}}let m=`JavaScript`,h={"c++":`C++`,cpp:`C++`,java:`Java`,python:`Python`,python3:`Python`,c:`C`,"c#":`C#`,csharp:`C#`,javascript:`JavaScript`,typescript:`TypeScript`,php:`PHP`,swift:`Swift`,kotlin:`Kotlin`,go:`Go`,ruby:`Ruby`,rust:`Rust`},g=``,_=document.querySelectorAll(`[id^="headlessui-listbox-button-"], [id^="headlessui-popover-button-"]`);for(let e=0;e<_.length;e++){let t=_[e]?.textContent?.trim().toLowerCase();if(t&&Object.keys(h).includes(t)){g=t;break}}if(!g){let e=(document.querySelector(`[data-track-load="editor_content"]`)||document.body).querySelectorAll(`button, .text-xs, .text-sm, [data-mode-id]`);for(let t=0;t<e.length;t++){let n=e[t],r=(n.getAttribute(`data-mode-id`)||n.textContent||``).trim().toLowerCase();if(r===`cpp`&&(r=`c++`),Object.keys(h).includes(r)){g=r;break}}}return g&&h[g]&&(m=h[g]),{title:o,slug:r,difficulty:u,tags:Array.from(new Set(f)),url:e,code:p,language:m,description:c}}async function i(){let e=document.getElementById(`keepsdsa-sync-btn`);if(!e)return;let t=e.innerHTML;e.innerHTML=`<span>Syncing...</span>`,e.style.opacity=`0.8`,e.style.pointerEvents=`none`;try{let t=r(),n=await new Promise(e=>{chrome.runtime.sendMessage({action:`syncToKeepsDSA`,payload:t},e)});if(n&&n.success)e.innerHTML=`
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Saved Successfully!</span>
      `,e.style.backgroundColor=`#16a34a`;else throw Error(n?.error||`Unknown error`)}catch(t){console.error(`KeepsDSA Sync Error:`,t),t.message&&t.message.includes(`Extension context invalidated`)?e.innerHTML=`<span>Refresh page to sync!</span>`:e.innerHTML=`<span>Error: ${t.message}</span>`,e.style.backgroundColor=`#dc2626`}finally{setTimeout(()=>{e&&(e.innerHTML=t,e.style.opacity=`1`,e.style.pointerEvents=`auto`,e.style.backgroundColor=`#2563eb`)},3e3)}}var a=location.href;new MutationObserver(()=>{let e=location.href;e!==a&&(a=e,setTimeout(t,2e3))}).observe(document,{subtree:!0,childList:!0}),setTimeout(t,2e3);})()
