/**
 * ArtDeOne AI Chat Widget - Simple Black & White Theme with User Icons
 * Super easy integration - just add this script to your website!
 * 
 * Usage: Add this line to your HTML before </body>:
 * <script src="artdeone-chat-simple.js"></script>
 */

(function() {
    'use strict';
    
    // Configuration matching your website theme
    const config = {
        apiUrl: 'http://localhost:3000/api/chat',
        position: 'bottom-right',
        width: 380,
        height: 500,
        darkColor: '#000000',      // Black
        lightColor: '#ffffff',      // White
        title: 'ART de ONE AI Assistant',
        placeholder: 'Type your message here...',
        welcomeMessage: 'Hi there! 👋 I\'m here to help you with Adobe Illustrator, vector art, and all things creative at ART de ONE. What would you like to learn today?'
    };
    
    // Create and inject styles
    const styles = `
        .artdeone-chat-widget {
            position: fixed;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .artdeone-chat-widget.bottom-right {
            bottom: 20px;
            right: 20px;
        }
        
        .artdeone-chat-window {
            position: absolute;
            background: ${config.lightColor};
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            display: none;
            flex-direction: column;
            overflow: hidden;
            width: ${config.width}px;
            height: ${config.height}px;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .artdeone-chat-window.open {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        
        .artdeone-chat-widget.bottom-right .artdeone-chat-window {
            bottom: 80px;
            right: 0;
        }
        
        .artdeone-chat-header {
            background: ${config.darkColor};
            color: ${config.lightColor};
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .artdeone-chat-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .artdeone-chat-avatar {
            width: 36px;
            height: 36px;
            background: ${config.darkColor};
            border: 2px solid ${config.lightColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: ${config.lightColor};
            transition: transform 0.2s ease;
        }
        
        .artdeone-chat-avatar:hover {
            transform: scale(1.1);
        }
        
        .artdeone-chat-title {
            font-weight: 600;
            font-size: 16px;
            margin: 0;
            color: ${config.lightColor};
            opacity: 0;
            animation: fadeInUp 0.5s ease forwards;
            animation-delay: 0.2s;
        }
        
        .artdeone-chat-subtitle {
            font-size: 12px;
            opacity: 0;
            margin: 0;
            color: ${config.lightColor};
            animation: fadeInUp 0.5s ease forwards;
            animation-delay: 0.3s;
        }
        
        .artdeone-chat-close {
            background: transparent;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${config.lightColor};
            font-size: 18px;
            font-weight: 300;
            transition: all 0.2s ease;
            opacity: 0.7;
        }
        
        .artdeone-chat-close:hover {
            background: rgba(255, 255, 255, 0.1);
            opacity: 1;
            transform: rotate(90deg);
        }
        
        .artdeone-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: ${config.lightColor};
        }
        
        .artdeone-chat-messages::-webkit-scrollbar {
            width: 4px;
        }
        
        .artdeone-chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .artdeone-chat-messages::-webkit-scrollbar-thumb {
            background: #e0e0e0;
            border-radius: 2px;
        }
        
        .artdeone-chat-message {
            margin-bottom: 16px;
            display: flex;
            gap: 10px;
            opacity: 0;
            animation: fadeInUp 0.4s ease forwards;
        }
        
        .artdeone-chat-message.user {
            flex-direction: row-reverse;
        }
        
        .artdeone-chat-message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
            transition: transform 0.2s ease;
        }
        
        .artdeone-chat-message-content:hover {
            transform: translateY(-1px);
        }
        
        .artdeone-chat-message.assistant .artdeone-chat-message-content {
            background: #f8f9fa;
            color: ${config.darkColor};
        }
        
        .artdeone-chat-message.user .artdeone-chat-message-content {
            background: ${config.darkColor};
            color: ${config.lightColor};
        }
        
        .artdeone-chat-message-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            flex-shrink: 0;
            opacity: 0;
            animation: fadeInUp 0.4s ease forwards;
            animation-delay: 0.1s;
        }
        
        .artdeone-chat-message-avatar.assistant {
            background: #f8f9fa;
            color: ${config.darkColor};
            border: 1px solid #e0e0e0;
        }
        
        .artdeone-chat-message-avatar.user {
            background: ${config.darkColor};
            color: ${config.lightColor};
            border: 1px solid #e0e0e0;
        }
        
        .artdeone-chat-typing {
            display: none;
            align-items: center;
            gap: 4px;
            padding: 12px 16px;
            background: #f8f9fa;
            border-radius: 18px;
            width: fit-content;
            margin-bottom: 16px;
            opacity: 0;
            animation: fadeInUp 0.3s ease forwards;
        }
        
        .artdeone-chat-typing.active {
            display: flex;
        }
        
        .artdeone-chat-typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${config.darkColor};
            animation: artdeone-chat-typing 1.4s infinite ease-in-out;
        }
        
        .artdeone-chat-typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .artdeone-chat-typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes artdeone-chat-typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
        
        .artdeone-chat-input-container {
            padding: 20px;
            background: ${config.lightColor};
        }
        
        .artdeone-chat-form {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .artdeone-chat-input {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 24px;
            font-size: 14px;
            outline: none;
            background: #f8f9fa;
            color: ${config.darkColor};
            transition: all 0.2s ease;
        }
        
        .artdeone-chat-input:focus {
            background: ${config.lightColor};
            box-shadow: 0 0 0 1px ${config.darkColor};
        }
        
        .artdeone-chat-input::placeholder {
            color: #999;
        }
        
        .artdeone-chat-send {
            background: ${config.darkColor};
            color: ${config.lightColor};
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            opacity: 0.8;
        }
        
        .artdeone-chat-send:hover {
            opacity: 1;
            transform: scale(1.05);
        }
        
        .artdeone-chat-send:active {
            transform: scale(0.95);
        }
        
        .artdeone-chat-button {
            background: ${config.darkColor};
            color: ${config.lightColor};
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.9;
        }
        
        .artdeone-chat-button:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.4);
            opacity: 1;
        }
        
        .artdeone-chat-button:active {
            transform: scale(0.95);
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 640px) {
            .artdeone-chat-window {
                width: calc(100vw - 32px) !important;
                height: 70vh !important;
            }
            
            .artdeone-chat-button {
                width: 52px;
                height: 52px;
                font-size: 20px;
            }
        }
    `;
    
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // Create chat widget HTML
    const widgetHTML = `
        <div class="artdeone-chat-window" id="artdeoneChatWindow">
            <div class="artdeone-chat-header">
                <div class="artdeone-chat-header-info">
                    <div class="artdeone-chat-avatar"></div>
                    <div>
                        <div class="artdeone-chat-title">${config.title}</div>
                        <div class="artdeone-chat-subtitle">${config.subtitle}</div>
                    </div>
                </div>
                <button class="artdeone-chat-close" onclick="artdeoneChat.toggle()">×</button>
            </div>
            
            <div class="artdeone-chat-messages" id="artdeoneChatMessages">
                <div class="artdeone-chat-message assistant">
                    <div class="artdeone-chat-message-avatar assistant"></div>
                    <div class="artdeone-chat-message-content">${config.welcomeMessage}</div>
                </div>
            </div>
            
            <div class="artdeone-chat-typing" id="artdeoneChatTyping">
                <div class="artdeone-chat-typing-dot"></div>
                <div class="artdeone-chat-typing-dot"></div>
                <div class="artdeone-chat-typing-dot"></div>
            </div>
            
            <div class="artdeone-chat-input-container">
                <form class="artdeone-chat-form" id="artdeoneChatForm">
                    <input 
                        type="text" 
                        class="artdeone-chat-input" 
                        id="artdeoneChatInput" 
                        placeholder="${config.placeholder}"
                        autocomplete="off"
                    >
                    <button type="submit" class="artdeone-chat-send">→</button>
                </form>
            </div>
        </div>
        
        <button class="artdeone-chat-button" onclick="artdeoneChat.toggle()">💬</button>
    `;
    
    // Create and inject widget
    const widget = document.createElement('div');
    widget.className = `artdeone-chat-widget ${config.position}`;
    widget.innerHTML = widgetHTML;
    document.body.appendChild(widget);
    
    // Chat functionality
    window.artdeoneChat = {
        isOpen: false,
        conversationHistory: [
            {
                role: 'system',
                content: 'You are a helpful AI assistant for ArtDeOne.com. You are here to help students and users with questions related to ArtDeOne.com. Be friendly, professional, and helpful. Focus on Adobe Illustrator, vector art, design courses, and creative services offered by ArtDeOne.'
            }
        ],
        
        toggle: function() {
            const chatWindow = document.getElementById('artdeoneChatWindow');
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                chatWindow.classList.add('open');
                setTimeout(() => {
                    document.getElementById('artdeoneChatInput').focus();
                }, 100);
            } else {
                chatWindow.classList.remove('open');
            }
        },
        
        addMessage: function(content, role) {
            const messagesContainer = document.getElementById('artdeoneChatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `artdeone-chat-message ${role}`;
            
            const avatar = document.createElement('div');
            avatar.className = `artdeone-chat-message-avatar ${role}`;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'artdeone-chat-message-content';
            messageContent.textContent = content;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageContent);
            messagesContainer.appendChild(messageDiv);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        },
        
        showTyping: function() {
            document.getElementById('artdeoneChatTyping').classList.add('active');
        },
        
        hideTyping: function() {
            document.getElementById('artdeoneChatTyping').classList.remove('active');
        },
        
        sendMessage: async function(message) {
            this.conversationHistory.push({
                role: 'user',
                content: message
            });
            
            this.showTyping();
            
            try {
                const response = await fetch(config.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: this.conversationHistory.slice(1)
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to get response');
                }
                
                const data = await response.json();
                
                this.conversationHistory.push({
                    role: 'assistant',
                    content: data.content
                });
                
                this.hideTyping();
                this.addMessage(data.content, 'assistant');
                
            } catch (error) {
                console.error('ArtDeOne Chat Error:', error);
                this.hideTyping();
                this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
            }
        }
    };
    
    // Event listeners
    document.getElementById('artdeoneChatForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('artdeoneChatInput');
        const message = input.value.trim();
        
        if (message) {
            artdeoneChat.addMessage(message, 'user');
            input.value = '';
            await artdeoneChat.sendMessage(message);
        }
    });
    
    document.getElementById('artdeoneChatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('artdeoneChatForm').dispatchEvent(new Event('submit'));
        }
    });
    
    console.log('ArtDeOne AI Chat Widget (Simple Black & White Theme) loaded successfully!');
})();