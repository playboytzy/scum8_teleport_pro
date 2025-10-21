// ==UserScript==
// @name         scum8_teleport_pro_v2
// @name:zh-CN   scum8商城传送页面增强
// @namespace    https://github.com/playboytzy/scum8_teleport_pro/
// @version      2.0
// @description  为scum8商城传送界面添加传送按钮可移动、删除
// @author       Meow-小猫
// @match        https://*.scum8.com/chuansong.html*
// @match        https://*.scum.plus/chuansong.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
const targetClasses = ["leaflet-marker-icon", "leaflet-daisy-label", "leaflet-zoom-animated", "leaflet-interactive"];
const targetSelector = targetClasses.map(cls => `.${cls}`).join('');

// 添加简洁样式
GM_addStyle(`
    .simplified-draggable {
        cursor: grab !important;
        position: relative;
    }
    .simplified-draggable:active {
        cursor: grabbing !important;
    }
    .marker-highlight {
        box-shadow: 0 0 0 2px #4299e1 !important;
        z-index: 999 !important;
    }
    .marker-delete-animation {
        animation: fadeOutScale 0.4s ease forwards;
    }
    .delete-button {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        height: 16px;
        background: #e53e3e;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        cursor: pointer;
        display: none;
        border: 1px solid white;
        font-weight: bold;
    }
    .simplified-draggable:hover .delete-button {
        display: block;
    }
    @keyframes fadeOutScale {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.1); }
    }
`);

let selectedMarker = null;

function initializeSimplifiedControls() {
    const markers = document.querySelectorAll(targetSelector);

    if (markers.length === 0) {
        setTimeout(initializeSimplifiedControls, 1500);
        return;
    }

    markers.forEach(marker => {
        if (!marker.classList.contains('simplified-controlled')) {
            setupMarkerFunctionality(marker);
            marker.classList.add('simplified-controlled');
        }
    });
}

function setupMarkerFunctionality(marker) {
    marker.classList.add('simplified-draggable');
    enableDrag(marker);

    // 添加删除按钮
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-button';
    deleteBtn.textContent = '×';
    marker.appendChild(deleteBtn);

    // 删除按钮点击事件
    deleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        deleteMarker(marker);
    });
}

function selectMarker(marker) {
    // 清除之前的选择
    if (selectedMarker) {
        selectedMarker.classList.remove('marker-highlight');
    }

    selectedMarker = marker;
    marker.classList.add('marker-highlight');

    // 显示操作提示（3秒后消失）
    showQuickTip('已选择标记：拖拽移动 | 点击×按钮删除');
}

function enableDrag(element) {
    let dragging = false;
    let startX, startY, initialX, initialY;

    element.addEventListener('mousedown', function(e) {
        if (e.button !== 2) return; // 只响应右键

        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = parseFloat(element.style.left) || 0;
        initialY = parseFloat(element.style.top) || 0;
    });

    document.addEventListener('mousemove', function(e) {
        if (!dragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        element.style.left = (initialX + deltaX) + 'px';
        element.style.top = (initialY + deltaY) + 'px';
    });

    document.addEventListener('mouseup', function() {
        dragging = false;
    });
}


function deleteMarker(marker) {
    if (confirm('确定要删除这个地图标记吗？\n\n删除操作无法撤销！')) {
        marker.classList.add('marker-delete-animation');
        setTimeout(() => {
            marker.remove();
            selectedMarker = null;
        }, 400);
    }
}

function showQuickTip(message) {
    // 移除现有提示
    const existingTip = document.getElementById('marker-quick-tip');
    if (existingTip) {
        existingTip.remove();
    }

    // 创建新提示
    const tip = document.createElement('div');
    tip.id = 'marker-quick-tip';
    tip.textContent = message;
    tip.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(45, 55, 72, 0.95);
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        border: 1px solid #4a5568;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(tip);

    // 3秒后淡出
    setTimeout(() => {
        tip.style.opacity = '0';
        setTimeout(() => tip.remove(), 300);
    }, 3000);
}

// 点击页面其他区域取消选择
document.addEventListener('click', function(e) {
    if (!e.target.closest(targetSelector) && selectedMarker) {
        selectedMarker.classList.remove('marker-highlight');
        selectedMarker = null;
    }
});

// 使用MutationObserver监听新标记
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
            setTimeout(initializeSimplifiedControls, 500);
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// 初始执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeSimplifiedControls, 2000);
    });
} else {
    setTimeout(initializeSimplifiedControls, 2000);
}
    // 查找所有包含指定类的元素
    const elements = document.querySelectorAll('.fixed.bottom-0.w-full.bg-base-200.bg-opacity-80.text-center.py-1.shadow-md');
    const elements1 = document.querySelectorAll('.fixed.bottom-4.right-4.z-50');
    // 移除这些元素
    elements.forEach(element => {
        element.remove();
    });
    elements1.forEach(element => {
        element.remove();
    });
    // 删除猫币span
    // 主要删除函数
    function removeTargetButtons() {
    // 查找所有类名为"opacity-80 ml-1"的元素
    const targetButtons = document.querySelectorAll('.opacity-80.ml-1');

    // 遍历并删除找到的元素
    targetButtons.forEach(button => {
        button.remove();
        console.log('已删除目标按钮元素');
    });

    // 如果找到了元素，显示操作结果
    if (targetButtons.length > 0) {
        console.log(`成功删除 ${targetButtons.length} 个目标按钮`);
    }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeTargetButtons);
    } else {
        removeTargetButtons();
    }

    // 监听动态内容变化（适用于SPA或异步加载内容）
    const observer1 = new MutationObserver(function(mutations) {
        removeTargetButtons();
    });

    // 开始观察文档变化
    observer1.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
