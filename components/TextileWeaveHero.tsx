export default function TextileWeaveHero() {
  return (
    <div style={{ width: "100%" }}>
      <style>{`
        @keyframes weave-fabricFade { 0%,80%{opacity:1} 84%,100%{opacity:0} }
        @keyframes weave-row0 { 0%,0%{stroke-dashoffset:1} 6.5%,100%{stroke-dashoffset:0} }
        @keyframes weave-row1 { 0%,7.5%{stroke-dashoffset:1} 14%,100%{stroke-dashoffset:0} }
        @keyframes weave-row2 { 0%,15%{stroke-dashoffset:1} 21.5%,100%{stroke-dashoffset:0} }
        @keyframes weave-row3 { 0%,22.5%{stroke-dashoffset:1} 29%,100%{stroke-dashoffset:0} }
        @keyframes weave-row4 { 0%,30%{stroke-dashoffset:1} 36.5%,100%{stroke-dashoffset:0} }
        @keyframes weave-row5 { 0%,37.5%{stroke-dashoffset:1} 44%,100%{stroke-dashoffset:0} }
        @keyframes weave-row6 { 0%,45%{stroke-dashoffset:1} 51.5%,100%{stroke-dashoffset:0} }
        @keyframes weave-row7 { 0%,52.5%{stroke-dashoffset:1} 59%,100%{stroke-dashoffset:0} }
        @keyframes weave-row8 { 0%,60%{stroke-dashoffset:1} 66.5%,100%{stroke-dashoffset:0} }
        @keyframes weave-sh0 { 0%,5.8%{opacity:0;transform:translateX(0) rotate(0deg)} 6.2%,6.3%{opacity:0.85} 6.5%{transform:translateX(562px) rotate(6deg)} 6.9%,100%{opacity:0} }
        @keyframes weave-sh1 { 0%,7%{opacity:0;transform:translateX(0) rotate(0deg)} 7.5%,7.6%{opacity:0.85} 13.8%,14%{transform:translateX(-562px) rotate(-5deg)} 14.3%,100%{opacity:0} }
        @keyframes weave-sh2 { 0%,14.5%{opacity:0;transform:translateX(0) rotate(0deg)} 15%,15.1%{opacity:0.85} 21.3%,21.5%{transform:translateX(562px) rotate(7deg)} 21.8%,100%{opacity:0} }
        @keyframes weave-sh3 { 0%,22%{opacity:0;transform:translateX(0) rotate(0deg)} 22.5%,22.6%{opacity:0.85} 28.8%,29%{transform:translateX(-562px) rotate(-6deg)} 29.3%,100%{opacity:0} }
        @keyframes weave-sh4 { 0%,29.5%{opacity:0;transform:translateX(0) rotate(0deg)} 30%,30.1%{opacity:0.85} 36.3%,36.5%{transform:translateX(562px) rotate(5deg)} 36.8%,100%{opacity:0} }
        @keyframes weave-sh5 { 0%,37%{opacity:0;transform:translateX(0) rotate(0deg)} 37.5%,37.6%{opacity:0.85} 43.8%,44%{transform:translateX(-562px) rotate(-7deg)} 44.3%,100%{opacity:0} }
        @keyframes weave-sh6 { 0%,44.5%{opacity:0;transform:translateX(0) rotate(0deg)} 45%,45.1%{opacity:0.85} 51.3%,51.5%{transform:translateX(562px) rotate(6deg)} 51.8%,100%{opacity:0} }
        @keyframes weave-sh7 { 0%,52%{opacity:0;transform:translateX(0) rotate(0deg)} 52.5%,52.6%{opacity:0.85} 58.8%,59%{transform:translateX(-562px) rotate(-5deg)} 59.3%,100%{opacity:0} }
        @keyframes weave-sh8 { 0%,59.5%{opacity:0;transform:translateX(0) rotate(0deg)} 60%,60.1%{opacity:0.85} 66.3%,66.5%{transform:translateX(562px) rotate(6deg)} 66.8%,100%{opacity:0} }

        @media (prefers-reduced-motion: no-preference) {
          .weave-wefts { animation: weave-fabricFade 20s ease-in-out infinite; }
          .weave-r0 { animation: weave-row0 20s linear infinite; } .weave-r1 { animation: weave-row1 20s linear infinite; }
          .weave-r2 { animation: weave-row2 20s linear infinite; } .weave-r3 { animation: weave-row3 20s linear infinite; }
          .weave-r4 { animation: weave-row4 20s linear infinite; } .weave-r5 { animation: weave-row5 20s linear infinite; }
          .weave-r6 { animation: weave-row6 20s linear infinite; } .weave-r7 { animation: weave-row7 20s linear infinite; }
          .weave-r8 { animation: weave-row8 20s linear infinite; }
          .weave-d0 { animation: weave-sh0 20s linear infinite; transform-origin: 58px 60px; }
          .weave-d1 { animation: weave-sh1 20s linear infinite; transform-origin: 620px 95px; }
          .weave-d2 { animation: weave-sh2 20s linear infinite; transform-origin: 58px 130px; }
          .weave-d3 { animation: weave-sh3 20s linear infinite; transform-origin: 620px 165px; }
          .weave-d4 { animation: weave-sh4 20s linear infinite; transform-origin: 58px 200px; }
          .weave-d5 { animation: weave-sh5 20s linear infinite; transform-origin: 620px 235px; }
          .weave-d6 { animation: weave-sh6 20s linear infinite; transform-origin: 58px 270px; }
          .weave-d7 { animation: weave-sh7 20s linear infinite; transform-origin: 620px 305px; }
          .weave-d8 { animation: weave-sh8 20s linear infinite; transform-origin: 58px 340px; }
        }
      `}</style>

      <svg
        width="100%"
        viewBox="0 0 680 380"
        role="img"
        aria-label="Animated illustration of a shuttle weaving thread through a loom"
      >
        <title>Woven textile hero animation</title>
        <desc>
          Warp threads with a shuttle passing back and forth across nine wavy
          weft rows, alternating above and below the warp as it weaves down
          the fabric, then fading and repeating slowly
        </desc>

        <g fill="none" stroke="#CFCFC4" strokeWidth="1" strokeLinecap="round" opacity="0.8">
          <path d="M62,40 Q65,140 61,240 T63,340" />
          <path d="M99,40 Q97,140 100,240 T98,340" />
          <path d="M136,40 Q139,140 135,240 T137,340" />
          <path d="M173,40 Q171,140 174,240 T172,340" />
          <path d="M210,40 Q213,140 209,240 T211,340" />
          <path d="M247,40 Q245,140 248,240 T246,340" />
          <path d="M284,40 Q287,140 283,240 T285,340" />
          <path d="M321,40 Q319,140 322,240 T320,340" />
          <path d="M358,40 Q361,140 357,240 T359,340" />
          <path d="M395,40 Q393,140 396,240 T394,340" />
          <path d="M432,40 Q435,140 431,240 T433,340" />
          <path d="M469,40 Q467,140 470,240 T468,340" />
          <path d="M506,40 Q509,140 505,240 T507,340" />
          <path d="M543,40 Q541,140 544,240 T542,340" />
          <path d="M580,40 Q583,140 579,240 T581,340" />
          <path d="M617,40 Q615,140 618,240 T616,340" />
        </g>

        <g className="weave-wefts">
          <g stroke="#868677" strokeWidth="0.85" strokeLinecap="round" fill="none">
            <path className="weave-r0" d="M58,60 Q135,57 210,61 T360,58 T510,61 T620,59" pathLength="1" strokeDasharray="1" />
            <path className="weave-r1" d="M620,96 Q545,93 470,97 T320,94 T170,97 T58,95" pathLength="1" strokeDasharray="1" />
            <path className="weave-r2" d="M58,129 Q135,132 210,128 T360,131 T510,128 T620,130" pathLength="1" strokeDasharray="1" />
            <path className="weave-r3" d="M620,166 Q545,163 470,167 T320,164 T170,167 T58,165" pathLength="1" strokeDasharray="1" />
            <path className="weave-r4" d="M58,199 Q135,202 210,198 T360,201 T510,198 T620,200" pathLength="1" strokeDasharray="1" />
            <path className="weave-r5" d="M620,236 Q545,233 470,237 T320,234 T170,237 T58,235" pathLength="1" strokeDasharray="1" />
            <path className="weave-r6" d="M58,269 Q135,272 210,268 T360,271 T510,268 T620,270" pathLength="1" strokeDasharray="1" />
            <path className="weave-r7" d="M620,306 Q545,303 470,307 T320,304 T170,307 T58,305" pathLength="1" strokeDasharray="1" />
            <path className="weave-r8" d="M58,339 Q135,342 210,338 T360,341 T510,338 T620,340" pathLength="1" strokeDasharray="1" />
          </g>
          <g stroke="#CFCFC4" strokeWidth="1" strokeLinecap="round" fill="none">
            <line className="weave-r0" x1="99" y1="55" x2="99" y2="65" pathLength="1" strokeDasharray="1" />
            <line className="weave-r0" x1="247" y1="55" x2="247" y2="65" pathLength="1" strokeDasharray="1" />
            <line className="weave-r0" x1="395" y1="55" x2="395" y2="65" pathLength="1" strokeDasharray="1" />
            <line className="weave-r0" x1="543" y1="55" x2="543" y2="65" pathLength="1" strokeDasharray="1" />
            <line className="weave-r1" x1="62" y1="90" x2="62" y2="100" pathLength="1" strokeDasharray="1" />
            <line className="weave-r1" x1="210" y1="90" x2="210" y2="100" pathLength="1" strokeDasharray="1" />
            <line className="weave-r1" x1="358" y1="90" x2="358" y2="100" pathLength="1" strokeDasharray="1" />
            <line className="weave-r1" x1="506" y1="90" x2="506" y2="100" pathLength="1" strokeDasharray="1" />
            <line className="weave-r2" x1="99" y1="125" x2="99" y2="135" pathLength="1" strokeDasharray="1" />
            <line className="weave-r2" x1="247" y1="125" x2="247" y2="135" pathLength="1" strokeDasharray="1" />
            <line className="weave-r2" x1="395" y1="125" x2="395" y2="135" pathLength="1" strokeDasharray="1" />
            <line className="weave-r2" x1="543" y1="125" x2="543" y2="135" pathLength="1" strokeDasharray="1" />
            <line className="weave-r3" x1="62" y1="160" x2="62" y2="170" pathLength="1" strokeDasharray="1" />
            <line className="weave-r3" x1="210" y1="160" x2="210" y2="170" pathLength="1" strokeDasharray="1" />
            <line className="weave-r3" x1="358" y1="160" x2="358" y2="170" pathLength="1" strokeDasharray="1" />
            <line className="weave-r3" x1="506" y1="160" x2="506" y2="170" pathLength="1" strokeDasharray="1" />
            <line className="weave-r4" x1="99" y1="195" x2="99" y2="205" pathLength="1" strokeDasharray="1" />
            <line className="weave-r4" x1="247" y1="195" x2="247" y2="205" pathLength="1" strokeDasharray="1" />
            <line className="weave-r4" x1="395" y1="195" x2="395" y2="205" pathLength="1" strokeDasharray="1" />
            <line className="weave-r4" x1="543" y1="195" x2="543" y2="205" pathLength="1" strokeDasharray="1" />
            <line className="weave-r5" x1="62" y1="230" x2="62" y2="240" pathLength="1" strokeDasharray="1" />
            <line className="weave-r5" x1="210" y1="230" x2="210" y2="240" pathLength="1" strokeDasharray="1" />
            <line className="weave-r5" x1="358" y1="230" x2="358" y2="240" pathLength="1" strokeDasharray="1" />
            <line className="weave-r5" x1="506" y1="230" x2="506" y2="240" pathLength="1" strokeDasharray="1" />
            <line className="weave-r6" x1="99" y1="265" x2="99" y2="275" pathLength="1" strokeDasharray="1" />
            <line className="weave-r6" x1="247" y1="265" x2="247" y2="275" pathLength="1" strokeDasharray="1" />
            <line className="weave-r6" x1="395" y1="265" x2="395" y2="275" pathLength="1" strokeDasharray="1" />
            <line className="weave-r6" x1="543" y1="265" x2="543" y2="275" pathLength="1" strokeDasharray="1" />
            <line className="weave-r7" x1="62" y1="300" x2="62" y2="310" pathLength="1" strokeDasharray="1" />
            <line className="weave-r7" x1="210" y1="300" x2="210" y2="310" pathLength="1" strokeDasharray="1" />
            <line className="weave-r7" x1="358" y1="300" x2="358" y2="310" pathLength="1" strokeDasharray="1" />
            <line className="weave-r7" x1="506" y1="300" x2="506" y2="310" pathLength="1" strokeDasharray="1" />
            <line className="weave-r8" x1="99" y1="335" x2="99" y2="345" pathLength="1" strokeDasharray="1" />
            <line className="weave-r8" x1="247" y1="335" x2="247" y2="345" pathLength="1" strokeDasharray="1" />
            <line className="weave-r8" x1="395" y1="335" x2="395" y2="345" pathLength="1" strokeDasharray="1" />
            <line className="weave-r8" x1="543" y1="335" x2="543" y2="345" pathLength="1" strokeDasharray="1" />
          </g>
        </g>

        <g fill="none" stroke="#C9CAFF" strokeWidth="0.75" strokeLinecap="round">
          <path className="weave-d0" d="M55,58 Q57,62 58,59 Q59,56 61,60" />
          <path className="weave-d1" d="M617,97 Q619,93 620,96 Q621,99 623,95" />
          <path className="weave-d2" d="M55,132 Q58,128 58,131 Q58,134 61,129" />
          <path className="weave-d3" d="M617,163 Q619,167 620,164 Q621,161 623,166" />
          <path className="weave-d4" d="M55,202 Q57,198 58,201 Q59,204 61,199" />
          <path className="weave-d5" d="M617,233 Q620,237 620,234 Q620,231 623,235" />
          <path className="weave-d6" d="M55,268 Q58,272 58,269 Q58,266 61,271" />
          <path className="weave-d7" d="M617,307 Q619,303 620,306 Q621,309 623,304" />
          <path className="weave-d8" d="M55,338 Q57,342 58,339 Q59,336 61,341" />
        </g>
      </svg>
    </div>
  );
}
