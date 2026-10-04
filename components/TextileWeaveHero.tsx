export default function TextileWeaveHero() {
  return (
    <div className="hero-fabric">


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
