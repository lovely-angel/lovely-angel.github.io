(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();var n;document.getElementById("hoverToButterflies").addEventListener("mouseenter",function(){document.getElementById("overlayButterflies").style.clipPath="circle(75% at 50% 50%)",clearTimeout(n),n=setTimeout(function(){window.location.href="/pages/butterflies.html"},1500)});document.getElementById("hoverToButterflies").addEventListener("mouseleave",function(){document.getElementById("overlayButterflies").style.clipPath="circle(0% at 50% 50%)",clearTimeout(n)});var i;document.getElementById("hoverToRose").addEventListener("mouseenter",function(){document.getElementById("overlayRose").style.clipPath="circle(75% at 50% 50%)",clearTimeout(i),i=setTimeout(function(){window.location.href="/pages/rose.html"},1500)});document.getElementById("hoverToRose").addEventListener("mouseleave",function(){document.getElementById("overlayRose").style.clipPath="circle(0% at 50% 50%)",clearTimeout(i)});
