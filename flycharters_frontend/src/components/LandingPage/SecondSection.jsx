import React from "react";

const NewSection = () => {
  return (
    <div className="bg-[#F8F9FA] h-screen px-4 md:px-24 font-serif flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full items-center">
        
        {/* Left points */}
        <div className="flex flex-col justify-between h-[65vh]">
          <div>
            <h2 className="text-[2.3rem] text-[#333] uppercase">1. Flight chartering</h2>
            <p className="text-sm text-gray-600 mt-2">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore adipisci atque eaque? Sint laborum nam temporibus cupiditate nulla aliquid laudantium eveniet nihil quam natus soluta asperiores explicabo, doloremque suscipit minima!
            </p>
          </div>
          <div>
            <h2 className="text-[2.3rem] text-[#333] uppercase">2. empty legs</h2>
            <p className="text-sm text-gray-600 mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta assumenda asperiores culpa id nemo porro, in vitae, odio reiciendis, ducimus quibusdam nulla adipisci nam. Eius ipsa fugiat consequuntur doloribus aperiam?
            </p>
          </div>
        </div>

        {/* Center image + text */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-[50vw] h-[65vh]">
            {/* Background rectangle */}
            <div className="absolute top-6 left-6 w-full h-full bg-[#dcd4cb] z-0"></div>
            {/* Main image */}
            <img
              src="/services2.webp"
              alt="Strategy"
              className="absolute top-0 left-0 w-full h-full object-cover z-10 shadow-md"
            />
            {/* Overlay text */}
            <h1 className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl text-white mix-blend-overlay z-20 italic">
              flyCharter
            </h1>
          </div>
        </div>

        {/* Right points */}
        <div className="flex flex-col justify-between h-[65vh]">
          <div>
            <h2 className="text-[2.3rem] text-[#333] uppercase">3. luxury services</h2>
            <p className="text-sm text-gray-600 mt-2">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus et placeat provident molestiae harum dolores excepturi numquam ut temporibus debitis ea natus illum voluptas facere, sapiente libero sunt veritatis. Veritatis.
            </p>
          </div>
          <div>
            <h2 className="text-[2.3rem] text-[#333] uppercase">4. luxury services</h2>
            <p className="text-sm text-gray-600 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ut quos nam porro molestias, atque aliquid id optio ex inventore culpa tenetur in similique minima cum unde vero sequi voluptatum!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewSection;
