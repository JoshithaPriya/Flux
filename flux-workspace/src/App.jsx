import React, { useState, useEffect, useRef } from 'react';
import { Zap, Send, Wifi, WifiOff, History, Database, ChevronRight, Rocket, Code, Copy, Check, Info, Layout, Server, Cpu, ShoppingBag, ArrowRight, Layers, X, MousePointer2, Globe } from 'lucide-react';

const CHAT_SESSIONS = {
  blockchain: {
    title: "Blockchain Gas Opt",
    icon: <Database size={16} />,
    messages: [
      { role: 'user', content: "I'm working on a voting contract for a DAO. The gas cost for the 'castVote' function is hitting 150k. That's way too high for mainnet deployment. My current implementation uses a dynamic array to track every single address that has voted to prevent double-voting. I suspect the O(n) lookup is the culprit.", id: 1 },
      { role: 'ai', content: "You're correct. Iterating through a dynamic array in Solidity is extremely gas-intensive because every 'Sload' operation costs gas. As the array grows, the function will eventually hit the block gas limit and fail. You should refactor this to use a 'mapping(address => bool)'. This changes your lookup from O(n) to O(1).", id: 2 },
      { role: 'user', content: "Chapter 1: Mapping Logic. Okay, I've switched to a mapping. But now I'm worried about how to tally the votes efficiently. If I can't iterate through the mapping, how do I get the total count without storing another massive array?", id: 3 },
      { role: 'ai', content: "The best practice is to maintain a 'uint256 public totalVotes' counter. Every time a vote is cast, increment this counter in the same transaction. This way, the data is always available at a constant gas cost. You can also use events to emit the vote details for off-chain indexing via a subgraph.", id: 4 },
      { role: 'user', content: "Chapter 2: Security Audit. Is reentrancy a risk if I add a small reward for voters? I'm using 'transfer()' to send 0.01 ETH back to the voter.", id: 5 },
      { role: 'ai', content: "Yes, 'transfer()' is risky due to gas limit changes. Use 'call{value: amount}(\"\")' instead, but you MUST implement a ReentrancyGuard. Always follow the Checks-Effects-Interactions pattern: update the 'voted' mapping BEFORE sending the ETH.", id: 6 },
      { role: 'user', content: "Chapter 3: Batch Processing. Can I process multiple votes in one transaction to save gas? I want to optimize for high-frequency voting rounds.", id: 7 },
      { role: 'ai', content: "Yes, use a 'calldata' array of addresses in a single function. By using 'unchecked' for your loop increments and reading from calldata instead of memory, you can save roughly 100-200 gas per vote in the batch.", id: 8 },
      { role: 'user', content: "Chapter 4: L2 Selection. Which L2 is best for low-cost DAO voting right now? Arbitrum or Base?", id: 9 },
      { role: 'ai', content: "Arbitrum or Base are currently the leaders. Base is particularly interesting for consumer apps because of its integration with the Coinbase ecosystem, while Arbitrum has the most mature DAO tooling (like Tally).", id: 10 },
      { role: 'user', content: "Chapter 5: Final Verification. How do I automate the verification process on Etherscan?", id: 11 },
      { role: 'ai', content: "Use the Hardhat verify plugin. Add your Etherscan API key to the config and run 'npx hardhat verify --network mainnet [contract_address]'. This ensures your source code is public and trustless.", id: 12 }
    ],
    chapters: [
      { id: 1, title: "1. Storage Optimization", startIndex: 2, superPrompt: "Refactoring the DAO smart contract to replace O(n) array loops with O(1) mappings. This change is critical for maintaining stable gas costs as the voter base scales, ensuring the 'castVote' function remains viable for high-traffic governance events." },
      { id: 2, title: "2. Reentrancy Protection", startIndex: 4, superPrompt: "Securing the reward distribution mechanism against reentrancy attacks. We are implementing the OpenZeppelin ReentrancyGuard and strictly following the Checks-Effects-Interactions pattern to prevent drainage of the reward pool during voter payouts." },
      { id: 3, title: "3. Low-Level Batching", startIndex: 6, superPrompt: "Implementing advanced gas-saving techniques for batch processing. This includes utilizing 'calldata' for input arrays and 'unchecked' arithmetic for loop counters, which reduces the computational overhead of processing multiple governance votes in a single transaction." },
      { id: 4, title: "4. Layer 2 Strategy", startIndex: 8, superPrompt: "Evaluating Arbitrum and Base for decentralized governance hosting. The focus is on finding a balance between low transaction fees and a mature developer ecosystem, specifically targeting compatibility with Tally and Snapshot for off-chain voting integration." },
      { id: 5, title: "5. Trustless Verification", startIndex: 10, superPrompt: "Standardizing the deployment pipeline by automating Etherscan source code verification. This ensures that the DAO's smart contract logic is fully transparent to all participants, fostering trust through public auditability of the verified bytecode." }
    ]
  },
  ecommerce: {
    title: "Amazon Automation",
    icon: <ShoppingBag size={16} />,
    messages: [
      { role: 'user', content: "I'm scaling my jewelry business on Amazon. I need an automated way to track profit margins across 50 SKUs. Manually downloading CSVs is taking hours.", id: 50 },
      { role: 'ai', content: "You should use the Amazon SP-API. It allows you to pull 'Settlement Reports' programmatically. You can then calculate net profit by subtracting FBA fees, referral fees, and advertising spend automatically.", id: 51 },
      { role: 'user', content: "Chapter 1: API Integration. How do I handle the OAuth flow for the SP-API? AWS IAM is confusing.", id: 52 },
      { role: 'ai', content: "You need to create an IAM User with a specific 'Selling Partner API' policy. Then, in Seller Central, register your developer profile and link it to your AWS User ARN to get your LWA (Login with Amazon) credentials.", id: 53 },
      { role: 'user', content: "Chapter 2: Financial Mapping. Does the API provide the specific 'Pick and Pack' fee per item accurately?", id: 54 },
      { role: 'ai', content: "Yes, the 'ListFinancialEvents' endpoint provides a granular breakdown. It includes 'FBAPerUnitFulfillmentFee', 'ReferralFee', and even 'StorageFee'. You can aggregate these per SKU to get your true net margin.", id: 55 },
      { role: 'user', content: "Chapter 3: PPC ROI analysis. I want to correlate my PPC spend with organic sales growth automatically to find my 'ACOS'.", id: 56 },
      { role: 'ai', content: "Fetch your 'Sponsored Products' performance reports via the Advertising API. Join that data with your 'Orders' report using SKU as the key. This will show you exactly which keywords are driving the most profitable sales.", id: 57 },
      { role: 'user', content: "Chapter 4: Inventory AI. Can the system predict when I'll run out of stock based on seasonal trends?", id: 58 },
      { role: 'ai', content: "By using a 30-day moving average of your sales velocity and factoring in lead times from your jewelry suppliers, we can build a 'Days of Cover' model. It will flag any SKU that has less than 14 days of stock left.", id: 59 },
      { role: 'user', content: "Chapter 5: Global Expansion. How do I scale this logic to the UK and DE marketplaces?", id: 60 },
      { role: 'ai', content: "The SP-API is region-specific but uses the same auth model. You just need to switch the endpoint to the 'EU' region and handle the currency conversion from GBP/EUR back to your base currency for unified reporting.", id: 61 }
    ],
    chapters: [
      { id: 1, title: "1. OAuth & IAM Setup", startIndex: 2, superPrompt: "Connecting Amazon Seller Central with AWS infrastructure using OAuth 2.0. This establishes the secure link required to bypass manual CSV management and begin real-time data ingestion for jewelry sales and inventory metrics." },
      { id: 2, title: "2. Margin Calculation", startIndex: 4, superPrompt: "Automating the deduction of granular FBA fulfillment fees from raw financial reports. This logic provides a real-time view of SKU-level profitability, allowing for immediate price adjustments based on fluctuating storage and referral costs." },
      { id: 3, title: "3. Advertising ROI", startIndex: 6, superPrompt: "Integrating the Amazon Advertising API with organic sales data. This section focuses on calculating Total ACOS (TACoS) to identify jewelry keywords that provide the highest organic lift versus those that only drive expensive paid conversions." },
      { id: 4, title: "4. Predictive Stocking", startIndex: 8, superPrompt: "Building an AI-driven inventory velocity model. By analyzing 30-day sales trends and supplier lead times, the system provides proactive alerts to prevent jewelry stockouts during peak shopping periods or international supply chain delays." },
      { id: 5, title: "5. Multi-Region Scale", startIndex: 10, superPrompt: "Expanding the automation pipeline to UK and EU marketplaces. This context handles multi-region API endpoint management and currency aggregation to provide a unified global view of the jewelry business across all Amazon territories." }
    ]
  },
  datascience: {
    title: "IITM DS Project",
    icon: <Cpu size={16} />,
    messages: [
      { role: 'user', content: "For my IIT Madras Data Science project, I have a massive dataset of 1M rows. My Jupyter notebook keeps crashing due to memory errors during data cleaning.", id: 70 },
      { role: 'ai', content: "Don't load the whole CSV at once. Use Pandas 'chunksize' parameter to process the data in blocks of 50,000 rows. Alternatively, use 'Dask' or 'Polars' which are optimized for multi-core processing and large data.", id: 71 },
      { role: 'user', content: "Chapter 1: Memory Optimization. How do I perform an 'imputation' for missing values if I'm processing in chunks? I need the global mean.", id: 72 },
      { role: 'ai', content: "Calculate the running sum and running count across all chunks first. Then divide (Total Sum / Total Count) to get the global mean. In the second pass, use that global mean to fill the NaNs in each chunk.", id: 73 },
      { role: 'user', content: "Chapter 2: Feature Engineering. I'm choosing between One-Hot Encoding and Label Encoding for my categorical variables.", id: 74 },
      { role: 'ai', content: "Use One-Hot Encoding if the categories are nominal (like 'House Colors' in Paradox). Use Label/Ordinal Encoding only if there is a clear order (like 'Low, Medium, High'). For high-cardinality data, try Target Encoding.", id: 75 },
      { role: 'user', content: "Chapter 3: Model Benchmarking. Should I use a Random Forest or XGBoost for this tabular data? I need high accuracy.", id: 76 },
      { role: 'ai', content: "XGBoost typically yields higher accuracy but requires more tuning. Start with a Random Forest as a baseline—it's very robust to outliers and doesn't require as much feature scaling.", id: 77 },
      { role: 'user', content: "Chapter 4: Model Deployment. How do I share this model as a functional API so my project teammate can use it?", id: 78 },
      { role: 'ai', content: "Wrap the model in a FastAPI app. Serialize the model using 'joblib' and create a /predict endpoint. You can host this for free on Render or Hugging Face Spaces for your demo.", id: 79 },
      { role: 'user', content: "Chapter 5: Visual Dashboards. What's the best library for interactive dashboards in Python for this dataset?", id: 80 },
      { role: 'ai', content: "Plotly or Streamlit are excellent. Since you are in the IITM BS program, Streamlit is perfect for quick deployment of data apps using just Python, allowing your team to explore the model's predictions visually.", id: 81 }
    ],
    chapters: [
      { id: 1, title: "1. Chunking Strategy", startIndex: 2, superPrompt: "Solving memory overflow errors in Pandas by implementing a two-pass chunking strategy. This context focuses on calculating global statistical means across 1M+ rows to perform accurate imputation of missing data without kernel crashes." },
      { id: 2, title: "2. Encoding Logic", startIndex: 4, superPrompt: "Optimizing categorical data representation for ML models. This section evaluates the performance trade-offs between One-Hot and Target Encoding for high-cardinality features within the IIT Madras project dataset." },
      { id: 3, title: "3. Ensemble Tuning", startIndex: 6, superPrompt: "Benchmarking Ensemble methods for high-accuracy tabular classification. Moving from Random Forest baselines to optimized XGBoost models, focusing on preventing overfitting through hyperparameter tuning and cross-validation." },
      { id: 4, title: "4. Inference API", startIndex: 8, superPrompt: "Building a scalable inference pipeline using FastAPI and Joblib. This context handles the serialization of the trained model and the creation of RESTful endpoints to allow collaborative testing for the final project submission." },
      { id: 5, title: "5. Streamlit Viz", startIndex: 10, superPrompt: "Creating interactive data visualization dashboards. Focusing on building a Streamlit interface that allows non-technical teammates to explore the results of the 1M row analysis and model performance in a live environment." }
    ]
  },
  react: {
    title: "React Grid Fix",
    icon: <Code size={16} />,
    messages: [
      { role: 'user', content: "My React CSS Grid is breaking on mobile screens. It looks great on desktop but everything overlaps on the iPhone view.", id: 300 },
      { role: 'ai', content: "Check your 'grid-template-columns'. If you use fixed pixel widths, it will overflow. Use '1fr' or 'auto-fit' for responsiveness.", id: 301 },
      { role: 'user', content: "Chapter 1: Responsive Grid. I'm using grid-template-columns: repeat(3, 200px). How do I make it fluid?", id: 302 },
      { role: 'ai', content: "Switch to 'repeat(auto-fit, minmax(200px, 1fr))'. This tells the grid to pack as many 200px columns as possible and distribute the remaining space.", id: 303 },
      { role: 'user', content: "Chapter 2: Performance. Every time I resize the window, the whole grid re-renders and lags.", id: 304 },
      { role: 'ai', content: "You might be running heavy calculations on every window resize. Wrap your layout logic in 'useMemo' and use a debounce hook for the resize listener.", id: 305 },
      { role: 'user', content: "Chapter 3: Custom Hooks. Can I move this resize logic into a separate reusable hook?", id: 306 },
      { role: 'ai', content: "Yes, create a 'useWindowSize' hook. It should return the current width and height, handling the event listener cleanup in a 'useEffect' to avoid memory leaks.", id: 307 },
      { role: 'user', content: "Chapter 4: Dark Mode. How do I make the grid colors swap smoothly between light and dark themes?", id: 308 },
      { role: 'ai', content: "Use Tailwind's 'dark:' variant or CSS variables. Define colors like '--bg-primary' and swap their values based on a '.dark' class on the body tag.", id: 309 },
      { role: 'user', content: "Chapter 5: Animation. I want the grid items to slide in when they appear. Should I use Framer Motion?", id: 310 },
      { role: 'ai', content: "Framer Motion is perfect for this. Wrap your items in a 'motion.div' and use the 'layout' prop to animate the grid repositioning automatically.", id: 311 }
    ],
    chapters: [
      { id: 1, title: "1. Responsive Layout", startIndex: 2, superPrompt: "Converting static CSS Grid definitions to fluid, auto-fit layouts. This ensures the React UI adapts to mobile viewports without overlapping elements or horizontal overflow." },
      { id: 2, title: "2. Resize Performance", startIndex: 4, superPrompt: "Optimizing layout performance using useMemo and debounced listeners. This context prevents UI stuttering during browser window resizing by stabilizing the render cycle." },
      { id: 3, title: "3. Reusable Hooks", startIndex: 6, superPrompt: "Implementing a clean useWindowSize custom hook. This logic centralizes viewport detection and ensures proper event listener cleanup to prevent memory leaks in the React application." },
      { id: 4, title: "4. Theming Engine", startIndex: 8, superPrompt: "Building a robust Dark Mode toggle for the Grid system. Utilizing Tailwind variants and CSS variables to provide a seamless visual transition between light and dark UI states." },
      { id: 5, title: "5. Motion Logic", startIndex: 10, superPrompt: "Integrating Framer Motion for grid entrance animations. Utilizing the 'layout' prop to handle complex repositioning animations as the grid structure changes dynamically." }
    ]
  },
  python: {
    title: "FastAPI Backend",
    icon: <Server size={16} />,
    messages: [
      { role: 'user', content: "I'm building an image processing API with FastAPI. Currently, the endpoint blocks until the image is processed, which takes 10 seconds. My frontend is timing out.", id: 400 },
      { role: 'ai', content: "In FastAPI, you shouldn't run long-blocking tasks directly in the route. Return a 202 Accepted status immediately and process the image in the background.", id: 401 },
      { role: 'user', content: "Chapter 1: Background Tasks. Should I use FastAPI's built-in BackgroundTasks or Celery?", id: 402 },
      { role: 'ai', content: "For simple tasks, 'BackgroundTasks' is fine. For heavy, multi-process image processing, use Celery with Redis to ensure the main API remains responsive.", id: 403 },
      { role: 'user', content: "Chapter 2: Redis Integration. How do I track the status of the Celery task so the frontend knows it's done?", id: 404 },
      { role: 'ai', content: "Store the Task ID in Redis. Create a polling endpoint like '/status/{task_id}' that checks the Celery result and returns 'Pending', 'In Progress', or 'Success'.", id: 405 },
      { role: 'user', content: "Chapter 3: WebSockets. Is polling efficient? Can I push the result to the client instead?", id: 406 },
      { role: 'ai', content: "WebSockets are much better for real-time updates. Have the client connect to a WS endpoint. When the worker finishes, publish to a Redis channel that the FastAPI app is listening to.", id: 407 },
      { role: 'user', content: "Chapter 4: Security. How do I protect the WebSocket connection from unauthorized users?", id: 408 },
      { role: 'ai', content: "Use JWT tokens in the WS handshake. Check the 'Authorization' header or a query parameter and validate it against your user database before allowing the connection.", id: 409 },
      { role: 'user', content: "Chapter 5: Deployment. How do I host this multi-service setup (FastAPI + Celery + Redis)?", id: 410 },
      { role: 'ai', content: "Docker Compose is the easiest way. Define each service in a 'docker-compose.yml' file and deploy them together on a VPS like DigitalOcean or AWS EC2.", id: 411 }
    ],
    chapters: [
      { id: 1, title: "1. Async Architecture", startIndex: 2, superPrompt: "Transitioning from synchronous API routes to background task processing. This ensures the FastAPI backend remains responsive while handling intensive image processing workloads." },
      { id: 2, title: "2. Task Tracking", startIndex: 4, superPrompt: "Implementing Redis-based status tracking for long-running Celery jobs. This provides a mechanism for the frontend to monitor progress and retrieve results via unique Task IDs." },
      { id: 3, title: "3. Real-time Sync", startIndex: 6, superPrompt: "Integrating WebSockets for instant task completion notifications. Replacing inefficient polling with a Pub/Sub model to push results directly from the worker to the client." },
      { id: 4, title: "4. Auth Security", startIndex: 8, superPrompt: "Securing persistent WebSocket connections using JWT authentication. Implementing a handshake-level validation to ensure only authorized users can receive task status updates." },
      { id: 5, title: "5. Multi-service Deployment", startIndex: 10, superPrompt: "Containerizing the full stack (FastAPI, Redis, Celery) using Docker Compose. This context covers the infrastructure requirements for deploying a distributed background processing system." }
    ]
  },
  ai: {
    title: "Gen AI Exchange",
    icon: <Zap size={16} />,
    messages: [
      { role: 'user', content: "I'm developing 'Arteza' for the hackathon. I need to generate high-fidelity product images from simple text prompts. How do I start?", id: 500 },
      { role: 'ai', content: "Use Stable Diffusion XL with an API like Replicate or OpenAI's DALL-E 3 for high-fidelity text rendering in images.", id: 501 },
      { role: 'user', content: "Chapter 1: Prompt Eng. How do I get consistent lighting for jewelry products?", id: 502 },
      { role: 'ai', content: "Add keywords like 'soft box lighting', 'macro photography', and 'bokeh' to your negative prompts to exclude harsh shadows.", id: 503 },
      { role: 'user', content: "Chapter 2: Video Generation. I want to animate these images into short marketing clips.", id: 504 },
      { role: 'ai', content: "Look into the 'Runway Gen-2' or 'Luma Dream Machine' APIs. You can provide the image as a reference frame for motion.", id: 505 },
      { role: 'user', content: "Chapter 3: Edge Cases. The AI keeps making the ring bands look deformed.", id: 506 },
      { role: 'ai', content: "Use a ControlNet model (Canny or Depth) to lock the shape of the jewelry while the AI generates the textures and environment.", id: 507 },
      { role: 'user', content: "Chapter 4: Upscaling. The generated images are too small for website banners.", id: 508 },
      { role: 'ai', content: "Use a Super-Resolution model like Real-ESRGAN to upscale the images to 4K without losing the fine details of the jewelry textures.", id: 509 },
      { role: 'user', content: "Chapter 5: API Integration. How do I host this as a React component for the hackathon demo?", id: 510 },
      { role: 'ai', content: "Create a simple Express backend that proxies your API keys and returns the image URL to your Vite frontend for real-time display.", id: 511 }
    ],
    chapters: [
      { id: 1, title: "1. Visual Prompts", startIndex: 2, superPrompt: "Advanced prompt engineering for jewelry product visualization. Focusing on macro photography lighting and negative prompt strategies to ensure consistent studio-quality results." },
      { id: 2, title: "2. Motion AI", startIndex: 4, superPrompt: "Implementing image-to-video pipelines for automated marketing asset generation. Leveraging Runway and Luma APIs to transform static product images into cinematic motion clips." },
      { id: 3, title: "3. Structural Control", startIndex: 6, superPrompt: "Utilizing ControlNet to maintain geometric integrity in AI-generated jewelry. This ensures that delicate ring bands and settings remain perfectly shaped during texture generation." },
      { id: 4, title: "4. Texture Upscaling", startIndex: 8, superPrompt: "Deploying Super-Resolution models for 4K asset production. Using Real-ESRGAN to upscale generated jewelry images for high-definition website banners and marketing material." },
      { id: 5, title: "5. Hackathon Integration", startIndex: 10, superPrompt: "Building a React-ready generative pipeline. Designing a proxy backend to safely handle Gen-AI API calls and deliver real-time visual results to the Arteza hackathon frontend." }
    ]
  }
};

export default function FluxApp() {
  const [view, setView] = useState('landing'); 
  const [activeChatId, setActiveChatId] = useState('blockchain');
  const [messages, setMessages] = useState(CHAT_SESSIONS.blockchain.messages);
  const [inputValue, setInputValue] = useState('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [cachedDraft, setCachedDraft] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showToast, setShowToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages(CHAT_SESSIONS[activeChatId].messages);
    setStartIndex(0);
  }, [activeChatId]);

  const triggerToast = (type, msg) => {
    setShowToast({ type, msg });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleJump = (index) => {
    setStartIndex(index);
    setIsTimelineOpen(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (isOfflineMode) {
      setCachedDraft(inputValue);
      setInputValue('');
      triggerToast('error', 'Network Interrupted: Message Cached.');
    } else {
      setMessages(prev => [...prev, { role: 'user', content: inputValue, id: Date.now() }]);
      setInputValue('');
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: "Context synchronized. New checkpoint created in your workflow timeline.", id: Date.now() + 1 }]);
      }, 700);
    }
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#171A29] flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden relative">
        <div className="z-10 text-center max-w-4xl animate-in fade-in zoom-in duration-700">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl animate-bounce"><Zap size={60} fill="white" /></div>
          </div>
          <h1 className="text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">FLUX WORKSPACE</h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">The resilient AI workspace that captures technical context in <span className="text-blue-400 font-bold">Chapters</span>. Built for complex, multi-stage engineering workflows.</p>
          <div className="flex gap-6 justify-center mb-20">
            <button onClick={() => setView('app')} className="px-12 py-6 bg-white text-[#171A29] rounded-[2rem] font-black text-xl flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-all active:scale-95">
              Enter Workspace <ArrowRight size={28} />
            </button>
            <button className="px-12 py-6 border-2 border-white/10 rounded-[2rem] font-bold text-slate-300 flex items-center gap-3 hover:bg-white/5 transition-all">
              <Layers size={22} /> Resilience Enabled
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { title: "Logical Jump", desc: "Instantly return to any technical checkpoint with zero data loss.", icon: <MousePointer2 className="text-blue-400" /> },
              { title: "Offline Resilience", desc: "Local-first caching engine handles internet drops mid-thought.", icon: <WifiOff className="text-red-400" /> },
              { title: "Super Prompts", desc: "AI-generated technical summaries for cross-tool context sync.", icon: <Zap className="text-yellow-400" /> }
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all">
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-black text-lg mb-2 uppercase tracking-tighter">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#171A29] text-white overflow-hidden font-sans">
      
      {/* Sidebar: Workspaces */}
      <aside className="w-[300px] flex flex-col border-r border-white/10 bg-[#171A29] shrink-0">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl"><Zap size={24} fill="white" /></div>
            <h1 className="text-2xl font-black tracking-tighter">FLUX</h1>
          </div>
          <button onClick={() => setView('landing')} className="text-slate-500 hover:text-white transition-colors">
            <Layout size={18} />
          </button>
        </div>

        <div className="px-6 py-8 flex-1 space-y-10 overflow-y-auto scrollbar-hide">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Offline Logic</span>
              <button onClick={() => setIsOfflineMode(!isOfflineMode)}
                className={`w-12 h-6 rounded-full relative transition-all ${isOfflineMode ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${isOfflineMode ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-2">Chat History</h3>
            <div className="space-y-3">
              {Object.entries(CHAT_SESSIONS).map(([id, chat]) => (
                <button key={id} onClick={() => setActiveChatId(id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${activeChatId === id ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-2xl scale-105' : 'text-slate-400 border-transparent hover:bg-white/5'}`}>
                  {chat.icon} {chat.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col bg-white relative">
        
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-10 bg-white z-20">
          <div className="flex items-center gap-4 text-[#171A29]">
            <div className="bg-slate-100 p-2 rounded-xl">{CHAT_SESSIONS[activeChatId].icon}</div>
            <h2 className="font-black text-xl tracking-tight uppercase">{CHAT_SESSIONS[activeChatId].title}</h2>
          </div>
          
          <button 
            onClick={() => setIsTimelineOpen(true)}
            className="flex items-center gap-3 bg-[#171A29] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <Layers size={16} /> Open Timeline
          </button>
        </header>

        {showToast && (
          <div className={`absolute top-24 left-1/2 -translate-x-1/2 z-50 px-10 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${showToast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
             {showToast.type === 'error' ? <WifiOff size={18} className="text-white" /> : <Check size={18} className="text-white" />}
             <span className="text-[11px] font-black text-white uppercase tracking-widest">{showToast.msg}</span>
          </div>
        )}

        {/* Chat Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-16 scroll-smooth scrollbar-hide">
          {startIndex > 0 && (
            <div className="flex flex-col items-center mb-8">
              <button onClick={() => setStartIndex(0)} className="group flex items-center gap-3 text-[10px] font-black text-white bg-[#171A29] px-10 py-4 rounded-full hover:scale-105 transition-all shadow-2xl uppercase tracking-[0.2em]">
                <History size={16} className="group-hover:rotate-[-90deg] transition-all duration-500" />
                Restore Full History
              </button>
              <div className="h-px w-32 bg-slate-100 mt-10" />
            </div>
          )}
          
          {messages.slice(startIndex).map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6`}>
              <div className={`max-w-[75%] p-8 text-[15px] leading-relaxed shadow-sm transition-all ${msg.role === 'user' ? 'bg-[#1F2338] text-white rounded-[2.5rem] rounded-br-none shadow-xl' : 'bg-[#F8FAFC] text-[#1F2338] rounded-[2.5rem] rounded-bl-none border border-slate-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Compact Action Bar */}
        <div className="p-10 bg-white border-t border-slate-50 flex flex-col items-center">
          {!isOfflineMode && cachedDraft && (
            <div className="w-full max-w-3xl mb-6 bg-blue-50/50 border border-blue-200 p-6 rounded-[2rem] flex items-center justify-between shadow-sm animate-in zoom-in-95">
              <div className="flex items-center gap-4 text-blue-900 font-bold text-sm">
                <History size={20} className="text-blue-600" /> 
                <span className="uppercase tracking-widest text-[11px]">Resilience Recovery Point Found</span>
              </div>
             
              <button 
               onClick={() => { 
    const userText = cachedDraft;
    const newUserMsg = { role: 'user', content: userText, id: Date.now() };
    
    // 1. Add your recovered message to the chat
    setMessages(prev => [...prev, newUserMsg]);
    setCachedDraft(null); 
    triggerToast('success', 'Context Re-synchronized');

    // 2. Trigger the AI Response for the recovered draft
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `✅ Resilience Engine: Context synchronized. I've processed your offline draft regarding: "${userText.substring(0, 40)}...". Proceeding with technical analysis now.`, 
        id: Date.now() + 1 
      }]);
    }, 800);
  }} 
  className="bg-[#171A29] hover:bg-black text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
>
  <Rocket size={16} /> Sync Draft
</button>
            </div>
          )}

          <form onSubmit={handleSend} className="relative w-full max-w-3xl group">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder={isOfflineMode ? "⚠ CONNECTION DROPPED: Saved to Cache..." : "Sync your technical thoughts to the timeline..."}
              className={`w-full border-2 rounded-2xl py-4 pl-10 pr-20 text-slate-900 shadow-xl focus:ring-4 transition-all outline-none text-base font-medium ${isOfflineMode ? 'bg-red-50 border-red-200 placeholder:text-red-300' : 'bg-[#F9FAFB] border-transparent focus:border-blue-500/10 group-hover:bg-white'}`}
            />
            <button type="submit" className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl text-white transition-all shadow-md ${isOfflineMode ? 'bg-red-400' : 'bg-[#171A29] hover:scale-105 active:scale-90 hover:bg-blue-600'}`}>
              <Send size={20} />
            </button>
          </form>
          <div className="mt-8 flex gap-12 opacity-20">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black">AES-256 Checkpoint Encryption</span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Local-First Storage</span>
          </div>
        </div>

        {/* COMPACT MODAL */}
          {/* ENHANCED LIGHT-MODE MODAL (LARGER FONTS & BOX) */}
{isTimelineOpen && (
  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#171A29]/70 backdrop-blur-md p-6 animate-in fade-in duration-300">
    {/* Increased max-width from max-w-md to max-w-xl */}
    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.35)] border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
      
      {/* Header - Increased Padding and Font */}
      <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-[#171A29] uppercase">Workflow Timeline</h3>
          <p className="text-xs text-blue-600 font-bold mt-2 uppercase tracking-[0.3em]">Context Checkpoints</p>
        </div>
        <button 
          onClick={() => setIsTimelineOpen(false)} 
          className="bg-slate-100 p-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 shadow-sm"
        >
          <X size={24} />
        </button>
      </div>

      {/* Chapter List - Increased Spacing and Text Sizes */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
        {CHAT_SESSIONS[activeChatId].chapters.map((chap, index) => (
          <div 
            key={chap.id} 
            style={{ animationDelay: `${index * 50}ms` }}
            className="group bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 hover:border-blue-400 hover:bg-white hover:shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-6"
          >
            <div className="flex items-center justify-between mb-5">
              {/* Increased font to text-lg */}
              <span className="text-lg font-black text-[#171A29] uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                {chap.title}
              </span>
              <div className="px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-200 shadow-sm">
                Verified
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 mb-6 relative border border-slate-200 group-hover:border-blue-100 transition-all shadow-inner">
              {/* Increased font to text-sm (14px) and improved leading */}
              <p className="text-[14px] text-slate-600 leading-relaxed italic pr-12">
                <span className="text-blue-600 font-black not-italic uppercase mr-3 tracking-widest text-[11px]">Smart Prompt:</span>
                {chap.superPrompt}
              </p>
              <button 
                onClick={() => { navigator.clipboard.writeText(chap.superPrompt); triggerToast('success', 'Prompt Copied'); }} 
                className="absolute top-6 right-6 text-slate-400 hover:text-blue-600 transition-colors hover:scale-110 active:scale-90"
              >
                <Copy size={22} />
              </button>
            </div>

            {/* Larger Button with bigger text */}
            <button 
              onClick={() => handleJump(chap.startIndex)}
              className="w-full bg-[#171A29] hover:bg-blue-600 text-white text-[12px] font-black uppercase py-5 rounded-[1.5rem] flex items-center justify-center gap-4 tracking-[0.25em] transition-all shadow-xl active:scale-95"
            >
              Jump to Context <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
         <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 italic">Flux Resilience Engine v4.0</span>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}