// Adiciona ícone de link externo a todos os links externos
(function() {
    'use strict';
    
    // Função para verificar se um link é externo
    function isExternalLink(url) {
        // Verifica se é um link absoluto (http:// ou https://)
        if (/^https?:\/\//.test(url)) {
            try {
                const linkUrl = new URL(url);
                const currentUrl = new URL(window.location.href);
                // Retorna true se o hostname for diferente
                return linkUrl.hostname !== currentUrl.hostname;
            } catch (e) {
                return false;
            }
        }
        return false;
    }
    
    // Função para adicionar ícone ao link
    function addExternalIcon(link) {
        // Verifica se já tem ícone
        if (link.querySelector('.external-link-icon')) {
            return;
        }
        
        // Cria o ícone
        const icon = document.createElement('span');
        icon.className = 'external-link-icon';
        icon.innerHTML = '↗';
        icon.setAttribute('aria-hidden', 'true');
        icon.style.cssText = 'margin-left: 0.25em; font-size: 0.85em; opacity: 0.7;';
        
        // Adiciona o ícone ao link
        link.appendChild(icon);
        
        // Adiciona atributos de segurança
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    }
    
    // Processa todos os links quando o DOM estiver pronto
    function processLinks() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && isExternalLink(href)) {
                addExternalIcon(link);
            }
        });
    }
    
    // Executa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processLinks);
    } else {
        processLinks();
    }
    
    // Observa mudanças dinâmicas no DOM (para conteúdo carregado via AJAX)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'A' && node.href) {
                        if (isExternalLink(node.href)) {
                            addExternalIcon(node);
                        }
                    } else {
                        const links = node.querySelectorAll && node.querySelectorAll('a[href]');
                        if (links) {
                            links.forEach(function(link) {
                                const href = link.getAttribute('href');
                                if (href && isExternalLink(href)) {
                                    addExternalIcon(link);
                                }
                            });
                        }
                    }
                }
            });
        });
    });
    
    // Inicia a observação
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

