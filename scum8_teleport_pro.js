// ==UserScript==
// @name         S141传送界面增强
// @namespace    https://github.com/playboytzy/S141_teleport_pro/
// @version      1.4
// @description  为scum8商城传送界面添加可拖动与可滑动功能，缩小传送按钮
// @author       Meow-小猫
// @match        https://*.scum8.com/chuansong.html
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
// 侧边栏
// 添加自定义样式
GM_addStyle(`
    .scum-slide-toggle {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 60px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 2px 0 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    .scum-slide-toggle:hover {
        background: #2980b9;
        width: 35px;
    }
    .scum-sidebar {
        transition: transform 0.3s ease, width 0.3s ease;
        transform-origin: left center;
    }
`);

// 主功能
function initSidebarSlider() {
    // 查找侧边栏元素
    let sidebar = document.querySelector('#app > div.flex.flex-col.min-h-screen > div.chuansong-sidebar > div.sidebar-content.bg-opacity-80.p-4.bg-black.rounded-lg');

    if (!sidebar) {
        console.log('未找到侧边栏元素，请检查页面结构');
        return;
    }
    // 添加拖动功能
    makeDraggable(sidebar);
    // 添加滑动功能
    addSlideFeature(sidebar);
}

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // 添加拖动区域（可以在侧边栏顶部添加一个拖动条）
        const dragBar = document.createElement('div');
        dragBar.style.height = '20px';
        dragBar.style.backgroundColor = 'rgba(0,0,0,0.1)';
        dragBar.style.cursor = 'move';
        dragBar.style.textAlign = 'center';
        dragBar.style.lineHeight = '20px';
        dragBar.innerHTML = '≡ 拖动 ≡';
        element.insertBefore(dragBar, element.firstChild);

        // 设置元素为可拖动
        element.style.position = 'absolute';
        element.style.zIndex = '9999';

        // 拖动条鼠标按下事件
        dragBar.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 停止移动
            document.onmouseup = null;
            document.onmousemove = null;
        }
            }
function addSlideFeature(sidebar) {
    // 设置侧边栏初始样式
    sidebar.style.position = 'fixed';
    sidebar.style.zIndex = '9998';
    sidebar.style.left = '0';
    sidebar.style.top = '0';
    sidebar.style.height = '100vh';
    sidebar.style.overflowY = 'auto';
    sidebar.style.backgroundColor = '#2c3e50';
    sidebar.style.color = '#ecf0f1';
    sidebar.style.boxShadow = '2px 0 10px rgba(0,0,0,0.3)';


}
//按钮
    const STYLE_CONFIG = {

        // 尺寸配置
        height: '20px',
        minHeight: '12px',
        borderRadius: '1px',
        // 边距配置
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        // 文字尺码
        fontSize: '12px',
        // 内边距配置
        padding: '0px 0px',
    };

    // 通过嵌套选择器提升CSS权重
    GM_addStyle(`
        body button.tm-adjusted,
        body input[type="button"].tm-adjusted,
        body input[type="submit"].tm-adjusted,
        body a[role="button"].tm-adjusted {
            height: ${STYLE_CONFIG.height};
            min-height: ${STYLE_CONFIG.minHeight};
            font-size: ${STYLE_CONFIG.fontSize};
            padding: ${STYLE_CONFIG.padding};
            border-radius: ${STYLE_CONFIG.borderRadius};
            margin: ${STYLE_CONFIG.marginTop} ${STYLE_CONFIG.marginRight} ${STYLE_CONFIG.marginBottom} ${STYLE_CONFIG.marginLeft};
            box-sizing: border-box;
            transition: all 0.2s ease;
        }

        body button.tm-adjusted:hover,
        body input.tm-adjusted:hover,
        body a.tm-adjusted:hover {
            filter: brightness(1.05);
            transform: translateY(-1px);
        }
    `);

    function applyStyles() {
        const buttons = document.querySelectorAll(`#app > div.flex.flex-col.min-h-screen > div.chuansong-map-container > ul.chuansong-locations > li.chuansong-location > button.btn.btn-primary.w-full.py-2.mt-2.text-sm`);
        buttons.forEach(btn => {
            btn.classList.add('tm-adjusted');
        });

    }

    // 使用更高效的DOM观察方式
    const observer = new MutationObserver(() => {
        requestAnimationFrame(applyStyles);
    });

    observer.observe(document, {
        subtree: true,
        childList: true
    });
    //隐藏1000猫币
//     // 配置需要删除的span所属的class名称
//     const TARGET_CLASS = '""';

//     function removeSpans() {
//         const spans = document.querySelectorAll(`span.${TARGET_CLASS}`);
//         spans.forEach(span => {
//             span.remove();
//             console.log(`已删除class为${TARGET_CLASS}的span元素`);
//         });
//     }

//     // 页面加载完成后执行
//     window.addEventListener('load', function() {
//         removeSpans();
//     });

//     // 监听DOM变化（针对动态加载内容）
//     const observer3 = new MutationObserver(function(mutations) {
//         removeSpans();
//     });

//     observer3.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
    // 初始执行
    window.addEventListener('load', applyStyles);
    // 延迟执行以确保DOM完全加载
    setTimeout(initSidebarSlider, 500);

})();
