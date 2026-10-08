export type LegislativeAchievement = {
  eyebrow: string;
  title: string;
  body: string;
  sourceUrl: string;
  sourceLabel: string;
};

export type PersonProfile = {
  strapline: string;
  summary: string;
  biography: string[];
  civicQuestion: string;
  recordLabel?: string;
  achievements: LegislativeAchievement[];
};

export const personProfiles: Record<string, PersonProfile> = {
  "ed-markey": {
    strapline: "A half-century bet that technology can be governed before it governs us.",
    summary:
      "Ed Markey's career is a tour through the hidden machinery of modern life: the electricity grid, the television cable, the family computer, the fuel tank, the atmosphere. Again and again, he has tried to drag technical systems into democratic view and make public rules catch up with private power.",
    biography: [
      "Markey arrived in Congress in the 1970s, when energy shocks made the politics of technology impossible to ignore. He built a career not around a single ideological theater but around systems most people only notice when they fail. Electricity deregulation, children's privacy, fuel economy, telecommunications, nuclear security and climate policy all became parts of the same argument: markets create enormous power, and representative government still has a duty to set the terms on which that power is used.",
      "That makes his story less about one famous vote than about persistence. Some of his biggest ideas became law; others, like the 2009 Waxman-Markey climate bill, cleared one chamber and died in the other. But even the defeats mattered. They established legislative vocabulary that later generations inherited. Markey's career is a reminder that Congress often changes the country twice: once when it passes a law, and once when it makes an idea politically imaginable.",
    ],
    civicQuestion:
      "What parts of daily life have become so technical that citizens stopped believing they could govern them?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Raised the floor under American fuel economy",
        body:
          "Markey was the principal House author of the 2007 fuel-economy provisions that required the first major increase in automobile efficiency standards in decades. The policy tied energy security, household costs and emissions to a number printed on every car window.",
        sourceUrl: "https://www.markey.senate.gov/about",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Enacted law",
        title: "Helped create a privacy rule for childhood online",
        body:
          "The Children's Online Privacy Protection Act made the collection of personal information from young children a matter of federal law rather than pure commercial discretion. Markey's role in the law became part of a much longer campaign over how technology companies treat minors.",
        sourceUrl: "https://www.markey.senate.gov/about",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "House milestone",
        title: "Put a national carbon limit through the House",
        body:
          "The Waxman-Markey bill of 2009 did not become law, but its passage was historic: a chamber of Congress had voted for an economy-wide system to cap greenhouse-gas pollution. Failure in the Senate did not erase the institutional breakthrough.",
        sourceUrl: "https://www.markey.senate.gov/about",
        sourceLabel: "Official Senate biography",
      },
    ],
  },

  "marsha-blackburn": {
    strapline: "From Tennessee conservatism to the rulebook of the digital economy.",
    summary:
      "Marsha Blackburn has spent much of her federal career where culture, commerce and technology collide. Her record ranges from online ticket bots and music royalties to sexual-harassment agreements and the reporting of child exploitation, a reminder that 'tech policy' often becomes human policy the moment a platform touches a life.",
    biography: [
      "Before the Senate, Blackburn built a profile in the House as a hard-edged conservative with a particular appetite for communications and technology questions. That combination made her a partisan combatant in some fights and a coalition-builder in others. The same lawmaker who became a national conservative voice also worked on bills that moved with overwhelming cross-party support.",
      "Her most durable legislative work tends to be concrete rather than abstract: who gets paid when a song streams, whether automated software can corner a ticket market, whether a nondisclosure clause can silence a survivor before a dispute even exists, whether online platforms must report crimes against children. Those are small doors into a larger civic question: when technology changes the facts of everyday life, how fast can law catch up?",
    ],
    civicQuestion:
      "Which modern abuses look 'too new for government' only because no one has yet written the rule?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Modernized how songwriters are paid",
        body:
          "Blackburn helped shepherd the Music Modernization Act, the landmark 2018 overhaul of music licensing that created a new framework for digital mechanical royalties and the Mechanical Licensing Collective.",
        sourceUrl: "https://www.blackburn.senate.gov/about-marsha",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Enacted law",
        title: "Made ticket bots a federal target",
        body:
          "The BOTS Act made it illegal to evade online ticket-purchasing limits through automated software and gave federal and state authorities new enforcement tools against bulk scalping schemes.",
        sourceUrl: "https://www.blackburn.senate.gov/about-marsha",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Enacted law",
        title: "Helped curb pre-dispute silencing of sexual-harassment claims",
        body:
          "The bipartisan Speak Out Act limits enforcement of nondisclosure and nondisparagement clauses agreed to before a sexual-assault or sexual-harassment dispute arises. Blackburn was part of the coalition that moved it into law.",
        sourceUrl: "https://www.blackburn.senate.gov/about-marsha",
        sourceLabel: "Official Senate biography",
      },
    ],
  },

  "mark-pocan": {
    strapline: "The small-business owner who brought labor politics back into the room.",
    summary:
      "Mark Pocan's politics are unusually legible: he came to Congress as a longtime small-business owner and an unapologetic labor progressive, then built institutions designed to force those worlds into the same conversation. His influence is as visible in caucuses and budget fights as it is in individual bill numbers.",
    biography: [
      "Pocan represents Madison and much of southern Wisconsin, but his political biography was formed before Washington: printing business, state legislature, organized labor, LGBT equality politics and the practical arithmetic of making payroll. In Congress he became a chair of the Progressive Caucus and a co-founder of the Labor Caucus and Defense Spending Reduction Caucus while also serving on Appropriations.",
      "His record illustrates an underappreciated form of legislative power. Not every consequential lawmaker is remembered for a statute bearing their name. Some build voting blocs, create durable caucuses, change what gets negotiated inside spending bills and keep issues alive until a coalition is possible. Pocan's current work on college affordability and animal-testing reform fits that pattern: make a moral argument, attach a mechanism, then build enough strange-bedfellow support to make it harder to dismiss.",
    ],
    civicQuestion:
      "Can a legislator change what Congress considers possible even before the final bill becomes law?",
    recordLabel: "Legislation & institution-building",
    achievements: [
      {
        eyebrow: "Institution-building",
        title: "Co-founded a congressional home for labor power",
        body:
          "Pocan co-founded and co-chairs the Labor Caucus, designed to put union organizing, wages and worker power into the daily legislative agenda rather than treating labor as an occasional constituency.",
        sourceUrl: "https://pocan.house.gov/about/committees-and-caucuses",
        sourceLabel: "Official House caucus page",
      },
      {
        eyebrow: "Introduced · 2026",
        title: "A bipartisan bid to end federally funded dog and cat testing",
        body:
          "The COMPACT Act would bar federal public-health research funds from supporting biomedical experiments on live dogs and cats, create transition rules and require protections and rehoming for animals already in facilities.",
        sourceUrl:
          "https://pocan.house.gov/media-center/press-releases/congressmen-pocan-and-langworthy-introduce-bipartisan-compact-act-end",
        sourceLabel: "Official House release",
      },
      {
        eyebrow: "Introduced · 2026",
        title: "Put a near-doubling of Pell Grants back on the table",
        body:
          "Pocan joined a bicameral coalition proposing to nearly double the maximum Pell Grant and index it to inflation, using his own experience as a Pell recipient to frame higher education as public mobility infrastructure.",
        sourceUrl:
          "https://pocan.house.gov/media-center/press-releases/pocan-scott-hirono-murray-reed-whitehouse-introduce-bill-make-college",
        sourceLabel: "Official House release",
      },
    ],
  },

  "bernie-sanders": {
    strapline: "The outsider who stayed long enough to become part of the institution.",
    summary:
      "Bernie Sanders built one of the strangest careers in modern American politics: an independent socialist from a tiny state who spent decades arguing that concentrated wealth distorts democracy, then accumulated enough seniority to chair major Senate committees and negotiate bills with people who rejected his worldview.",
    biography: [
      "Sanders' public persona is built on repetition, but repetition is also the point. From Burlington mayor to the House to the Senate and two presidential campaigns, he has returned to the same structural questions: who owns, who pays, who has bargaining power, who gets health care, and whose voice is amplified by money. The remarkable part is not merely that the message survived; it is that parts of it migrated into the center of national debate.",
      "His legislative record is more pragmatic than the rhetoric suggests. As Veterans' Affairs Committee chair, he negotiated a sweeping 2014 reform with Republican Senator John McCain amid a national crisis over veterans' access to care. He also used bargaining leverage in larger packages to expand community health centers. The lesson is not that ideology disappears in Congress. It is that ideology becomes consequential when someone learns where the levers are.",
    ],
    civicQuestion:
      "What happens when a political idea is repeated for decades instead of abandoned after one losing election?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Brokered the 2014 veterans' access overhaul",
        body:
          "As chair of the Senate Veterans' Affairs Committee, Sanders negotiated with John McCain on the bipartisan Veterans Access, Choice, and Accountability Act after revelations of dangerous VA wait times.",
        sourceUrl: "https://www.sanders.senate.gov/about-bernie/",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Health policy",
        title: "Expanded the community-health-center model",
        body:
          "Sanders made community health centers a recurring negotiating priority, securing major federal investment for clinics that provide primary care in underserved communities, including funding connected to the Affordable Care Act.",
        sourceUrl: "https://www.sanders.senate.gov/about-bernie/",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Agenda-setting",
        title: "Moved single-payer health care from the margins",
        body:
          "Medicare for All has not become law, but Sanders transformed it from a largely activist demand into legislation with national co-sponsors, presidential-debate centrality and a durable constituency inside Congress.",
        sourceUrl: "https://www.sanders.senate.gov/legislation/medicare-for-all/",
        sourceLabel: "Official Senate issue page",
      },
    ],
  },

  "sheldon-whitehouse": {
    strapline: "A prosecutor's obsession with the machinery behind the visible fight.",
    summary:
      "Sheldon Whitehouse often works one layer beneath the headline. Whether the subject is opioids, oceans, courts or dark money, his instinct is to map the network behind the event: who funded it, which institution moved it, what rule made it possible, and where law can still reach.",
    biography: [
      "Before the Senate, Whitehouse served as Rhode Island's U.S. attorney and attorney general. That prosecutorial background carried into a legislative style built around systems, evidence and long campaigns. His speeches about climate change became famous for their sheer persistence, but his more concrete record includes bipartisan work on addiction, criminal justice, ocean policy and chemical safety.",
      "Whitehouse's politics can be intensely combative, especially around the Supreme Court and political spending. Yet some of his most significant laws emerged through coalitions broad enough to survive polarization. That tension is central to Congress itself: the same senator can spend one hour accusing institutions of capture and the next negotiating statutory language with the other party.",
    ],
    civicQuestion:
      "When a public crisis appears sudden, what institutions and incentives were quietly building it for years?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Helped build the first broad federal opioid response",
        body:
          "Whitehouse was a principal architect of the Comprehensive Addiction and Recovery Act, a major bipartisan law expanding prevention, treatment, recovery and overdose-response tools during the opioid crisis.",
        sourceUrl: "https://www.whitehouse.senate.gov/about/",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Enacted law",
        title: "Created a permanent fund for oceans and coasts",
        body:
          "His ocean work helped establish dedicated federal support for research, restoration and coastal resilience, reflecting Rhode Island's dependence on marine systems and a long-running Senate focus on ocean policy.",
        sourceUrl: "https://www.whitehouse.senate.gov/about/",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Oversight campaign",
        title: "Made judicial influence networks a public argument",
        body:
          "Through hearings, speeches and legislation, Whitehouse has pushed Congress to examine anonymous political spending and outside influence around the federal judiciary. The campaign remains contested, but it has made institutional transparency a sustained Senate issue.",
        sourceUrl: "https://www.whitehouse.senate.gov/issues/courts/",
        sourceLabel: "Official Senate issue page",
      },
    ],
  },

  "james-lankford": {
    strapline: "The quiet technician who keeps turning administrative headaches into statutes.",
    summary:
      "James Lankford rarely fits the cinematic stereotype of a senator. His legislative signature is closer to systems engineering: disaster finance, federal hiring, excess property, charitable deductions, pharmacy-benefit transparency. The subjects sound procedural until they affect a town, a worker or a prescription.",
    biography: [
      "Lankford came to politics after years in Baptist ministry and youth-program leadership, then moved from the House to the Senate with a reputation for process, oversight and conservative governance. He can be a fierce partisan on cultural questions, but some of his most durable work has come through bipartisan administrative reform.",
      "That combination makes him useful for understanding what Congress actually does between the televised battles. A large share of federal power lives in procurement rules, grant systems, property inventories, reimbursement formulas and deadlines. Legislators who understand those systems can change real outcomes without ever producing a slogan that fits on a yard sign.",
    ],
    civicQuestion:
      "How much of governing is hidden inside rules most voters never hear debated?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Turned private-sector hiring ideas into federal practice",
        body:
          "The bipartisan TALENT Act created a pathway for technology and innovation experts to serve short tours in government and bring outside expertise into federal problem-solving.",
        sourceUrl: "https://www.lankford.senate.gov/",
        sourceLabel: "Official Senate office",
      },
      {
        eyebrow: "Enacted law",
        title: "Built a revolving-loan tool for disaster resilience",
        body:
          "The STORM Act authorized FEMA to provide capitalization grants for state and local hazard-mitigation revolving loan funds, shifting some disaster policy from rebuilding after catastrophe toward financing resilience before it.",
        sourceUrl: "https://www.lankford.senate.gov/",
        sourceLabel: "Official Senate office",
      },
      {
        eyebrow: "Enacted law · 2026",
        title: "Advanced pharmacy-benefit transparency",
        body:
          "Lankford-backed provisions aimed at prescription-drug middlemen became law in 2026, adding disclosure and accountability requirements around pharmacy benefit manager practices.",
        sourceUrl: "https://www.lankford.senate.gov/",
        sourceLabel: "Official Senate office",
      },
    ],
  },

  "jim-clyburn": {
    strapline: "A civil-rights organizer who learned to move power through formulas, corridors and broadband maps.",
    summary:
      "James Clyburn's career begins in the moral language of the civil-rights movement and ends, again and again, in the granular language of appropriations. That is not a contradiction. It is his theory of power: justice becomes durable when it is written into where money, infrastructure and institutions actually go.",
    biography: [
      "Clyburn came of age in segregated South Carolina, was jailed during civil-rights activism and later became the state's first Black member of Congress since Reconstruction. He rose to the highest levels of House leadership, serving multiple terms as Majority Whip and becoming one of the most consequential internal vote-counters of his generation.",
      "But his most revealing work is geographic. He helped build heritage corridors that preserve Gullah/Geechee culture and Reconstruction history, pushed formulas that steer federal investment toward persistently poor communities, and made rural broadband a civil-rights and economic-development issue. Clyburn's record argues that representation is not merely being present in the room; it is changing the map of who gets connected to the country.",
    ],
    civicQuestion:
      "What would civil rights look like if we measured it in roads, bandwidth, parks, clinics and household bills?",
    achievements: [
      {
        eyebrow: "Enacted policy",
        title: "Made persistent poverty visible in federal spending",
        body:
          "Clyburn's '10-20-30' approach directs a share of certain federal investments toward counties with persistent poverty, turning a moral claim about neglected communities into a budgeting rule.",
        sourceUrl: "https://clyburn.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Enacted law",
        title: "Helped put $65 billion behind broadband access",
        body:
          "Clyburn's Accessible, Affordable Internet for All framework helped shape the broadband provisions of the 2021 infrastructure law, which committed historic federal funding to deployment, affordability and digital inclusion.",
        sourceUrl: "https://clyburn.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Place & memory",
        title: "Turned overlooked history into national heritage",
        body:
          "His work helped create or elevate the South Carolina National Heritage Corridor, the Gullah/Geechee Cultural Heritage Corridor, Congaree National Park and the Reconstruction Era National Historical Park.",
        sourceUrl: "https://clyburn.house.gov/about/biography",
        sourceLabel: "Official House biography",
      },
    ],
  },

  "scott-peters": {
    strapline: "A legislator fascinated by the unglamorous sentence that can make a system work.",
    summary:
      "Scott Peters has built a career around problems that often die from being too technical for politics: drug reimbursement, carbon capture, student-loan benefits, power-grid permitting, veterans' peer support and housing supply. His bet is that boring details are where governing becomes real.",
    biography: [
      "Peters came to Congress from San Diego local government, where housing, water, infrastructure and budgets arrive without ideological abstraction: a permit is late, a pipe leaks, a neighborhood cannot build. In Washington he gravitated toward the same kind of policy plumbing, often working across party lines on narrowly designed bills that could survive divided government.",
      "The result is a record unusually rich in provisions that became law through larger packages. That legislative route is easy to miss because the final statute may carry another name. But it is how Congress often operates: write a discrete fix, build enough support, and attach it to the vehicle that can actually reach a president's desk.",
    ],
    civicQuestion:
      "Would we judge Congress differently if we followed provisions instead of bill titles?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Made employer student-loan repayment a durable benefit",
        body:
          "Peters' Employer Participation in Repayment Act helped create tax-favored employer contributions toward workers' student loans. The benefit was first made temporary during the pandemic and later made permanent.",
        sourceUrl: "https://scottpeters.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Enacted law",
        title: "Moved carbon capture from slogan toward infrastructure",
        body:
          "The USE IT Act, which Peters helped lead, supported carbon-utilization research and streamlined parts of the permitting framework for carbon dioxide infrastructure.",
        sourceUrl: "https://scottpeters.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Enacted law · 2026",
        title: "Put housing-supply reform into federal statute",
        body:
          "Peters' Housing Supply Expansion Act became part of the 2026 ROAD to Housing Act, using federal policy to press the supply side of the affordability crisis rather than treating high housing costs only as a demand problem.",
        sourceUrl: "https://scottpeters.house.gov/",
        sourceLabel: "Official House office",
      },
    ],
  },

  "marc-veasey": {
    strapline: "A North Texas organizer who treats the ballot and the paycheck as parts of the same democratic promise.",
    summary:
      "Marc Veasey's congressional identity joins two issues that politics often separates: voting power and economic power. He has built caucuses around both, arguing that democracy is weakened when citizens cannot reach the ballot and when workers cannot see a path to stable, dignified work.",
    biography: [
      "Veasey rose through the Texas House before winning a new congressional district anchored in Dallas-Fort Worth. In Congress he moved across Armed Services, Science and Technology, Small Business and Energy and Commerce, gaining a vantage point on the industrial and infrastructure questions reshaping North Texas.",
      "His most distinctive institutional contribution has been caucus-building. He founded the Congressional Voting Rights Caucus as states fought over access to the polls and co-launched the Blue Collar Caucus to focus on unions, wage stagnation, offshoring and manufacturing. Those caucuses do not themselves make law. They do something prior to law: assemble lawmakers around a problem so that votes, hearings and bills have somewhere to grow.",
    ],
    civicQuestion:
      "What good is formal political equality if citizens lack either a ballot they can use or an economy they can enter?",
    recordLabel: "Legislation & coalition-building",
    achievements: [
      {
        eyebrow: "Institution-building",
        title: "Founded the Congressional Voting Rights Caucus",
        body:
          "Veasey created the caucus to give lawmakers a permanent organizing structure around barriers to voting and the modern enforcement of voting-rights protections.",
        sourceUrl: "https://veasey.house.gov/about/full-biography",
        sourceLabel: "Official House biography",
      },
      {
        eyebrow: "Institution-building",
        title: "Co-launched the Blue Collar Caucus",
        body:
          "The caucus was built around wage stagnation, offshoring, union power and job security in manufacturing and the building trades, translating working-class economic politics into an internal congressional coalition.",
        sourceUrl: "https://veasey.house.gov/about/full-biography",
        sourceLabel: "Official House biography",
      },
      {
        eyebrow: "Committee power",
        title: "Worked at the crossroads of energy, health and industry",
        body:
          "Through Energy and Commerce and Armed Services, Veasey has operated on the committees where grid policy, health coverage, telecommunications and major North Texas defense industries are written into federal law and oversight.",
        sourceUrl: "https://veasey.house.gov/issues",
        sourceLabel: "Official House priorities",
      },
    ],
  },

  "greg-landsman": {
    strapline: "A former teacher who discovered that one way to move Congress is to make delay politically unbearable.",
    summary:
      "Greg Landsman's short congressional career already contains a useful lesson in legislative pressure: when a popular bill had been stranded for decades, he joined the effort to force it onto the floor rather than waiting for leadership to decide the time was right.",
    biography: [
      "Before Congress, Landsman taught, worked on antipoverty initiatives and helped lead the Cincinnati effort that created universal preschool funding. He entered the House with a municipal politician's instinct for tangible outcomes: the classroom opens, the benefit arrives, the project gets built.",
      "His role in the Social Security Fairness Act fight made that instinct visible in Washington. The legislation to repeal two provisions that reduced benefits for many public servants had been introduced again and again. Landsman joined a bipartisan push to use the House's discharge process and force a vote. The bill finally cleared Congress and became law in early 2025. It is a story about procedure, but procedure here meant retirement income for millions of people.",
    ],
    civicQuestion:
      "When leadership will not schedule a vote, how much power do ordinary members still have to create one?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Helped force the Social Security Fairness Act onto the floor",
        body:
          "Landsman joined the bipartisan discharge effort that broke a decades-long logjam over repealing the Windfall Elimination Provision and Government Pension Offset. The bill passed and was signed into law in January 2025.",
        sourceUrl: "https://landsman.house.gov/about",
        sourceLabel: "Official House biography",
      },
      {
        eyebrow: "Local public policy",
        title: "Helped build Cincinnati's preschool expansion",
        body:
          "Before entering Congress, Landsman helped lead the coalition behind a local ballot measure funding preschool expansion. It is part of the political biography he carried to Washington: policy as something residents should be able to point to.",
        sourceUrl: "https://landsman.house.gov/about",
        sourceLabel: "Official House biography",
      },
    ],
  },

  "mike-johnson": {
    strapline: "A constitutional lawyer who reached the Speaker's chair through one of the House's most chaotic passages.",
    summary:
      "Mike Johnson became Speaker after a historic internal revolt removed his predecessor and weeks of failed nominations left the House unable to function. Whatever one thinks of his politics, his speakership is a study in the strange power of rules, factions and the ability to assemble 218 votes.",
    biography: [
      "Johnson entered Congress from Louisiana as a constitutional lawyer and social conservative. He rose unusually fast through the Republican conference, moving from policy and conference leadership into the speakership in 2023 after the chamber exhausted several higher-profile candidates.",
      "The office changed the scale of his legislative responsibility overnight. A rank-and-file member can define himself by the bills he authors; a Speaker is judged by whether the institution can pass appropriations, defense policy, disaster aid, tax legislation and other must-move measures while holding a majority together. Johnson's record therefore belongs to a different category: not sole authorship, but control of the floor on which national coalitions either form or fail.",
    ],
    civicQuestion:
      "How much of national policy depends not on who has the best argument, but on who controls what reaches the floor?",
    recordLabel: "Speakership & legislative leadership",
    achievements: [
      {
        eyebrow: "Institutional leadership",
        title: "Reassembled a House after the first removal of a Speaker",
        body:
          "Johnson became the 56th Speaker after Kevin McCarthy's removal left the House leaderless. His election ended a multiweek paralysis and gave a fractured chamber a working majority structure again.",
        sourceUrl: "https://www.speaker.gov/about/",
        sourceLabel: "Official Speaker biography",
      },
      {
        eyebrow: "House leadership",
        title: "Moved major national-security packages through a divided conference",
        body:
          "As Speaker, Johnson put consequential foreign-aid and national-security legislation on the floor even when doing so exposed deep divisions inside his own party. The episode illustrated the Speaker's core power: deciding when a vote matters more than internal unanimity.",
        sourceUrl: "https://www.speaker.gov/",
        sourceLabel: "Office of the Speaker",
      },
      {
        eyebrow: "House leadership · 2026",
        title: "Steered housing and security legislation through the chamber",
        body:
          "His speakership has continued to organize House passage of major packages including 2026 housing and security legislation. Those laws and bills reflect coalition leadership rather than personal authorship, which is how this page credits them.",
        sourceUrl: "https://www.speaker.gov/",
        sourceLabel: "Office of the Speaker",
      },
    ],
  },

  "anna-paulina-luna": {
    strapline: "An insurgent lawmaker testing how much leverage one member can create.",
    summary:
      "Anna Paulina Luna came to Congress from the new populist right, but her legislative experiments sometimes produce alliances that scramble the expected map: antitrust-style credit-card politics with Alexandria Ocasio-Cortez, youth social-media restrictions with bipartisan sponsors, and pesticide liability fights that put her against major industry interests.",
    biography: [
      "Luna served in the Air Force before entering politics and became the first Mexican-American woman elected to Congress from Florida. She arrived as a combative Freedom Caucus member comfortable using procedural leverage, public pressure and discharge petitions rather than treating leadership's agenda as the only agenda.",
      "That style makes her a useful character in the modern House. The chamber is polarized, but individual issues can still create unusual coalitions when lawmakers identify a shared antagonist or a shared public frustration. Luna's record is still young, and much of it remains legislation in motion rather than finished statute. The interesting question is whether insurgency can mature into durable law.",
    ],
    civicQuestion:
      "Can ideological outsiders build governing coalitions without ceasing to be outsiders?",
    achievements: [
      {
        eyebrow: "House action · 2026",
        title: "Won House support for tougher pesticide accountability",
        body:
          "Luna advanced language aimed at preventing federal pesticide law from becoming a blanket liability shield for manufacturers, putting consumer and state-law accountability into a high-stakes agriculture debate.",
        sourceUrl: "https://luna.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Bipartisan legislation",
        title: "Joined AOC on a 10% credit-card interest cap",
        body:
          "Luna and Alexandria Ocasio-Cortez introduced legislation to cap credit-card interest rates at 10 percent, an alliance that crossed ideological lines around household debt and financial power.",
        sourceUrl: "https://luna.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Bipartisan legislation",
        title: "Pushed age protections for social media",
        body:
          "Luna became part of the bipartisan House coalition behind the Kids Off Social Media Act, an effort to restrict young children's access and reshape platform obligations toward minors.",
        sourceUrl: "https://luna.house.gov/",
        sourceLabel: "Official House office",
      },
    ],
  },

  "erin-houchin": {
    strapline: "A rural legislator turning reading science, housing supply and mental-health access into federal text.",
    summary:
      "Erin Houchin's emerging record is a reminder that Congress can still produce policy from subjects that begin far from cable news. Literacy instruction, manufactured housing, 988 crisis information and rural-hospital cybersecurity are not culture-war abstractions; they are problems with a user standing on the other end.",
    biography: [
      "Houchin came to the House after service in the Indiana Senate and work focused on children and families. Representing a largely rural southern Indiana district, she has concentrated on education, broadband, housing and access problems that look different outside major metropolitan areas.",
      "Her legislative style has leaned toward relatively bounded interventions: make evidence-based reading practice easier to identify, lower barriers to certain forms of housing, put the 988 crisis line in front of students, help small hospitals defend themselves against cyberattacks. None of those alone remakes the republic. Together they show how representative government can still function as a repair shop.",
    ],
    civicQuestion:
      "How many national problems become solvable when Congress defines the user clearly enough?",
    achievements: [
      {
        eyebrow: "House passage · 2026",
        title: "Advanced the Science of Reading Act",
        body:
          "Houchin pushed legislation built around evidence-based reading instruction, an effort to make federal education policy reward practices supported by the science of how children learn to read.",
        sourceUrl: "https://houchin.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "House passage · 2026",
        title: "Targeted barriers to affordable manufactured housing",
        body:
          "The Affordable HOMES Act passed the House with bipartisan support, aiming to reduce regulatory barriers that can raise the cost of manufactured housing.",
        sourceUrl: "https://houchin.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Bipartisan legislation",
        title: "Connected schools to the 988 crisis lifeline",
        body:
          "The Campus Lifeline Act seeks to make 988 suicide and crisis resources more visible to students, treating awareness of the hotline as basic public-safety infrastructure.",
        sourceUrl: "https://houchin.house.gov/",
        sourceLabel: "Official House office",
      },
    ],
  },

  "eric-burlison": {
    strapline: "A libertarian streak inside a chamber built for collective decisions.",
    summary:
      "Eric Burlison arrived in Washington with a Missouri record of limited-government politics and a taste for questioning the scope of federal power. The interesting tension is structural: Congress can reduce government only by using government, which means even anti-bureaucratic politics must eventually master legislation.",
    biography: [
      "Burlison served in both chambers of the Missouri legislature before winning a House seat in 2022. In Washington he aligned with the Freedom Caucus and emphasized spending restraint, regulatory skepticism and decentralization, while also taking on region-specific issues such as the future of Table Rock Lake.",
      "His record remains young. Some of the most visible items are House-passed or committee-stage bills rather than enacted statutes. That distinction matters, and Fireside Chat preserves it. A legislative career is not only a trophy shelf of laws; it is also a record of which problems a member chooses to force onto the institutional agenda.",
    ],
    civicQuestion:
      "Can a movement skeptical of federal power become effective without becoming expert in federal power?",
    achievements: [
      {
        eyebrow: "House passage · 2026",
        title: "Advanced the Smart Space Act",
        body:
          "Burlison's Smart Space Act moved through the House as part of an effort to modernize how federal agencies use and account for office space, aiming to reduce the cost of underused property.",
        sourceUrl: "https://burlison.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Committee action · 2026",
        title: "Pushed federal protections for Table Rock Lake",
        body:
          "Burlison secured movement for provisions affecting Table Rock Lake through the water-resources process, an example of the intensely local work hidden inside large national infrastructure bills.",
        sourceUrl: "https://burlison.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Legislative agenda",
        title: "Made deregulation itself a bill-writing project",
        body:
          "From labor rules to federal spending and health policy, Burlison has used legislation to challenge existing regulatory structures rather than limiting his role to rhetorical opposition.",
        sourceUrl: "https://burlison.house.gov/legislation",
        sourceLabel: "Official House legislation page",
      },
    ],
  },

  "ted-cruz": {
    strapline: "A courtroom debater who discovered that the Senate's most durable victories often arrive through coalition.",
    summary:
      "Ted Cruz became nationally famous for confrontation: a government shutdown fight, presidential debates, Supreme Court arguments and a willingness to antagonize his own party's leadership. Yet his enacted record is a parallel story about narrower coalitions in space policy, sanctions, education savings and infrastructure.",
    biography: [
      "Before the Senate, Cruz was Texas solicitor general and argued repeatedly before the U.S. Supreme Court. He brought that adversarial style to Washington in 2013 and quickly became one of the chamber's best-known insurgents. The visibility made him a presidential contender; it also sometimes obscured the less theatrical work that actually reached the statute book.",
      "Cruz's legislative career shows two Senates occupying the same room. One is a stage for national ideological conflict. The other is a workshop where members negotiate launch rules, NASA authorization, sanctions and transportation designations. Understanding him requires watching both.",
    ],
    civicQuestion:
      "Why do the same lawmakers who seem incapable of agreement on television quietly write laws together elsewhere?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Helped write the rules for a commercial space age",
        body:
          "Cruz was a leading Senate force behind the U.S. Commercial Space Launch Competitiveness Act, which updated federal policy for a rapidly expanding private space industry.",
        sourceUrl: "https://www.cruz.senate.gov/about/biography",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Enacted law",
        title: "Put human-shields sanctions into federal law",
        body:
          "Cruz authored legislation creating sanctions aimed at terrorist organizations and actors that use civilians as human shields, turning a law-of-war concern into a financial penalty framework.",
        sourceUrl: "https://www.cruz.senate.gov/about/biography",
        sourceLabel: "Official Senate biography",
      },
      {
        eyebrow: "Enacted law",
        title: "Expanded 529 education savings beyond college",
        body:
          "Cruz-backed tax provisions expanded the permissible use of 529 education savings accounts to include qualifying K-12 expenses, a significant federal change in the school-choice debate.",
        sourceUrl: "https://www.cruz.senate.gov/about/biography",
        sourceLabel: "Official Senate biography",
      },
    ],
  },

  "dan-crenshaw": {
    strapline: "A combat veteran trying to translate battlefield seriousness into a House built for argument.",
    summary:
      "Dan Crenshaw's biography can overwhelm his politics: Navy SEAL, grievously wounded in Afghanistan, partial sight restored through surgery, then a return to service. In Congress, the more revealing story is how that experience interacts with intelligence, health policy and the machinery of national security.",
    biography: [
      "Crenshaw lost his right eye to an improvised explosive device in Afghanistan in 2012 and later returned to duty before retiring medically from the Navy. He entered Congress in 2019 with instant national visibility and a political style that mixes conservative argument with frequent criticism of performative politics inside his own coalition.",
      "His committee work on Energy and Commerce and Intelligence has pulled him toward questions where rhetoric collides with implementation: how agencies buy technology, how Medicaid pays, how the United States secures supply chains, and how intelligence reaches decision-makers. His record is still developing, but the through-line is institutional competence as a political value.",
    ],
    civicQuestion:
      "What changes when a politician treats competence itself as something that has to be defended?",
    achievements: [
      {
        eyebrow: "House passage",
        title: "Targeted bad technology procurement",
        body:
          "Crenshaw's Acquisition Review Board Act passed the House unanimously, proposing stronger review of certain Department of Homeland Security technology acquisitions before agencies become trapped in costly failures.",
        sourceUrl: "https://crenshaw.house.gov/about/",
        sourceLabel: "Official House biography",
      },
      {
        eyebrow: "Enacted provisions · 2025",
        title: "Carried health-policy provisions into a major package",
        body:
          "Crenshaw secured multiple health-policy provisions in 2025 legislation, including changes affecting Medicaid and provider reimbursement. The provisions are part of a larger law rather than stand-alone statutes.",
        sourceUrl: "https://crenshaw.house.gov/",
        sourceLabel: "Official House office",
      },
      {
        eyebrow: "Committee work",
        title: "Brought a veteran's lens into intelligence oversight",
        body:
          "His service on the House Intelligence Committee placed a former special operator inside Congress's civilian oversight of the intelligence community—one of the constitutional loops that keeps military and intelligence power answerable to elected government.",
        sourceUrl: "https://crenshaw.house.gov/about/",
        sourceLabel: "Official House biography",
      },
    ],
  },

  "jared-huffman": {
    strapline: "An environmental lawyer governing a district where policy is visible in coastlines, forests and water.",
    summary:
      "Jared Huffman's politics were formed in Northern California, where climate policy is not an atmospheric abstraction. It is salmon habitat, fire, drought, public land, fishing economies and whether a small town can build housing without erasing the landscape that sustains it.",
    biography: [
      "Before Congress, Huffman was an environmental lawyer and California legislator. He wrote or advanced state policies on energy efficiency, solar water heating, paint recycling and corporate forms designed to recognize public benefit. In Washington, that background turned into sustained work on oceans, public lands, climate and water.",
      "His federal record includes plenty of legislation that has advanced without becoming law, which is worth showing honestly. Environmental lawmaking often takes multiple Congresses, shifting coalitions and inclusion in larger packages. Huffman's career is a case study in that long horizon: write the map, protect the coalition, keep the language alive.",
    ],
    civicQuestion:
      "How long should a democracy be willing to work on a problem whose consequences unfold over generations?",
    recordLabel: "Legislation & long-horizon campaigns",
    achievements: [
      {
        eyebrow: "Public-lands campaign",
        title: "Built a durable Northwest California conservation package",
        body:
          "Huffman has repeatedly advanced legislation linking wilderness protection, recreation, forest restoration and local economic priorities in Northwest California, keeping a complex regional agreement alive across Congresses.",
        sourceUrl: "https://huffman.house.gov/about/meet-jared",
        sourceLabel: "Official House biography",
      },
      {
        eyebrow: "Climate policy",
        title: "Pressed for an end to new offshore drilling",
        body:
          "Representing a long Pacific coastline, Huffman has made offshore-drilling restrictions and ocean protection recurring federal priorities, connecting local risk to national energy policy.",
        sourceUrl: "https://huffman.house.gov/issues/climate-change",
        sourceLabel: "Official House climate page",
      },
      {
        eyebrow: "State-law legacy",
        title: "Carried practical environmental regulation from Sacramento to Washington",
        body:
          "His California record included energy-efficiency, solar hot-water and recycling measures—experience that shaped a federal style focused less on environmental branding than on enforceable systems.",
        sourceUrl: "https://huffman.house.gov/about/meet-jared",
        sourceLabel: "Official House biography",
      },
    ],
  },

  "guy-reschenthaler": {
    strapline: "A Navy lawyer who found a legislative niche in victims' rights, first responders and the rules around public service.",
    summary:
      "Guy Reschenthaler rose rapidly inside the House Republican leadership, but some of his clearest legislative wins came before the title: bipartisan laws on police mental health, child-sex-abuse victims, public-safety officers and veterans.",
    biography: [
      "Reschenthaler served as a Navy judge advocate in Iraq before entering the Pennsylvania Senate and then Congress. That legal and military background shows up in a record drawn toward public-safety institutions, veterans and the procedural gaps that can leave victims or public servants without a remedy.",
      "His political rise into House leadership is the other half of the story. Whips operate in the realm between belief and arithmetic. They count, persuade, trade information and discover whether a conference actually has the votes it claims to have. It is one of the least romantic and most decisive jobs in a legislature.",
    ],
    civicQuestion:
      "How much political power is simply the ability to know where every vote really stands?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Put mental-health support closer to police officers",
        body:
          "The COPS Counseling Act created stronger confidentiality protections for peer counseling programs used by law-enforcement officers, acknowledging that first-responder trauma can become a public-safety issue when help is inaccessible.",
        sourceUrl: "https://reschenthaler.house.gov/about",
        sourceLabel: "Official House biography",
      },
      {
        eyebrow: "Enacted law",
        title: "Expanded support for injured public-safety officers",
        body:
          "Reschenthaler helped move the Public Safety Officer Support Act, expanding federal benefits for certain first responders and their families when trauma or occupational injury produces lasting harm.",
        sourceUrl: "https://reschenthaler.house.gov/about",
        sourceLabel: "Official House biography",
      },
      {
        eyebrow: "Enacted law",
        title: "Removed federal time limits for child-sex-abuse civil claims",
        body:
          "He helped advance the Eliminating Limits to Justice for Child Sex Abuse Victims Act, which removed the federal civil statute of limitations for certain claims involving child sexual abuse.",
        sourceUrl: "https://reschenthaler.house.gov/about",
        sourceLabel: "Official House biography",
      },
    ],
  },

  "al-franken": {
    strapline: "A comedian entered the Senate and discovered that the punch line was often a percentage buried in statute.",
    summary:
      "Al Franken's political story is almost too neatly American: a Saturday Night Live writer becomes a senator by 312 votes, then spends years proving that comedy celebrity and legislative seriousness are not mutually exclusive. His career later ended in resignation amid sexual-misconduct allegations, leaving a record that cannot be reduced either to the scandal or to the work that came before it.",
    biography: [
      "Franken entered the Senate in 2009 after an eight-month recount and immediately faced the suspicion that he was a performer playing politician. He responded by becoming unusually detail-oriented, especially on Judiciary and health policy. The most consequential example was almost invisible to the public: a requirement that insurers spend a minimum share of premium dollars on health care rather than administration and profit.",
      "His bipartisan criminal-justice work followed the same pattern. The Comprehensive Justice and Mental Health Act paired law enforcement with treatment systems for mental illness and substance use. Franken resigned in 2018 after multiple women accused him of inappropriate conduct; he disputed aspects of the allegations while saying the Senate needed to function. The full story is therefore about talent, policy, accountability and the fact that public careers can contain achievements and failure at the same time.",
    ],
    civicQuestion:
      "Can citizens hold two truths about a public figure at once without using one to erase the other?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Put the 80/20 rule into health insurance",
        body:
          "Franken authored the Affordable Care Act's medical-loss-ratio requirement, generally requiring insurers in major markets to spend at least 80 or 85 percent of premium revenue on health care and quality improvement or return money to consumers.",
        sourceUrl: "https://www.alfranken.com/about",
        sourceLabel: "Al Franken biography",
      },
      {
        eyebrow: "Bipartisan legislation",
        title: "Linked criminal justice to mental-health treatment",
        body:
          "Franken introduced the Comprehensive Justice and Mental Health Act with a bipartisan coalition, expanding collaboration among courts, law enforcement, veterans' services, mental-health treatment and substance-use systems.",
        sourceUrl: "https://www.govinfo.gov/app/details/BILLS-114s993is",
        sourceLabel: "GovInfo bill record",
      },
    ],
  },

  "trey-gowdy": {
    strapline: "A prosecutor who turned congressional questioning into a form of political theater—and institutional power.",
    summary:
      "Trey Gowdy's congressional influence was never mainly about a shelf of statutes. It was about oversight: the constitutional power to ask questions, compel records, expose contradictions and decide which facts deserved hours of public attention.",
    biography: [
      "Gowdy spent years as a federal prosecutor and South Carolina solicitor before entering the House in 2011. His courtroom habits traveled with him. He became nationally known through the Benghazi Select Committee and later chaired the House Oversight Committee, roles that made him one of the chamber's most visible interrogators.",
      "Oversight is inherently contested. Supporters saw rigor and accountability; critics saw investigations shaped by partisan priorities and pointed to inquiries Gowdy declined to pursue as aggressively. That disagreement belongs on the page because it reveals what oversight actually is: not neutral fact-finding floating above politics, but a constitutional power whose legitimacy depends on how it is used.",
    ],
    civicQuestion:
      "What makes an investigation legitimate when the investigator is also a partisan actor?",
    recordLabel: "Oversight & legislation",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Helped secure restitution support for child-pornography victims",
        body:
          "Gowdy was the House sponsor of the Amy, Vicky, and Andy Child Pornography Victim Assistance Act, which created a clearer restitution framework for victims whose images continue to circulate.",
        sourceUrl:
          "https://www.tillis.senate.gov/2018/12/tillis-co-sponsored-legislation-assisting-child-pornography-victims-signed-into-law",
        sourceLabel: "Senate release on enactment",
      },
      {
        eyebrow: "Constitutional function",
        title: "Chaired two of the House's most visible investigative bodies",
        body:
          "Gowdy chaired the Select Committee on Benghazi and later the Committee on Oversight and Government Reform. Those positions placed him at the center of Congress's power to investigate the executive branch.",
        sourceUrl: "https://history.house.gov/People/Detail/14284",
        sourceLabel: "House Historian",
      },
    ],
  },

  "jason-chaffetz": {
    strapline: "An insurgent candidate who became guardian of the government's internal watchdogs.",
    summary:
      "Jason Chaffetz entered Congress after defeating an incumbent without the machinery political professionals considered necessary. Years later, as Oversight chairman, he was writing laws about the machinery government itself needs to police misconduct.",
    biography: [
      "Chaffetz built his first congressional campaign around austerity, retail politics and contempt for the conventional campaign apparatus. In the House he eventually chaired Oversight and Government Reform, turning from outsider candidate to institutional gatekeeper.",
      "His strongest bipartisan legacy lies in watchdog law. Inspectors general are among the least glamorous actors in Washington, but they are the people assigned to find waste, fraud and abuse inside agencies. Chaffetz worked with Democrat Elijah Cummings and others to strengthen their access to information, while also passing narrower laws for FBI whistleblowers and Secret Service overtime.",
    ],
    civicQuestion:
      "What institutions protect the public when the scandal is too small for a headline but too serious to ignore?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Strengthened the independence of inspectors general",
        body:
          "The Inspector General Empowerment Act clarified that agency watchdogs are entitled to the information they need to investigate waste, fraud and abuse, and strengthened tools for obtaining evidence.",
        sourceUrl:
          "https://oversight.house.gov/release/chaffetz-cummings-meadows-legislation-empowering-inspectors-general-signed-law/",
        sourceLabel: "House Oversight Committee",
      },
      {
        eyebrow: "Enacted law",
        title: "Expanded protection for FBI whistleblowers",
        body:
          "Chaffetz-sponsored legislation clarified that FBI employees are protected when they make lawful whistleblower disclosures to managers and supervisors in their chain of command.",
        sourceUrl:
          "https://oversight.house.gov/release/two-chaffetz-bills-aimed-helping-law-enforcement-signed-law/",
        sourceLabel: "House Oversight Committee",
      },
      {
        eyebrow: "Enacted law",
        title: "Addressed overtime for Secret Service agents",
        body:
          "A second Chaffetz bill signed in 2016 temporarily fixed a pay-cap problem affecting agents working extraordinary hours during a demanding presidential-protection cycle.",
        sourceUrl:
          "https://oversight.house.gov/release/two-chaffetz-bills-aimed-helping-law-enforcement-signed-law/",
        sourceLabel: "House Oversight Committee",
      },
    ],
  },

  "newt-gingrich": {
    strapline: "The historian who treated Congress itself as something that could be redesigned—and shattered.",
    summary:
      "Newt Gingrich did not merely win elections; he changed the incentives of congressional politics. He helped end four decades of Democratic House control, nationalized local races, centralized message discipline and made confrontation with the presidency a governing strategy. Modern Congress still lives in the architecture he helped build.",
    biography: [
      "A history professor before Congress, Gingrich spent years organizing House Republicans for a majority that seemed almost unimaginable when he arrived in 1979. The 1994 Republican wave and the Contract with America made him Speaker and turned him into the central strategist of a new, more nationalized House politics.",
      "His speakership produced major laws through both conflict and compromise, including welfare reform and the 1997 balanced-budget agreement. It also accelerated forms of partisan combat that critics argue weakened Congress as a deliberative institution. To read Gingrich well is to resist easy moral sorting. He was both a legislative innovator and one of the people who taught modern politicians that institutional escalation could be electorally rewarding.",
    ],
    civicQuestion:
      "When a political strategy wins power, how long do its effects remain after the strategist leaves?",
    recordLabel: "Speakership & institutional change",
    achievements: [
      {
        eyebrow: "Institutional change",
        title: "Engineered the Republican takeover of the House",
        body:
          "Gingrich helped build the strategy that produced the 1994 Republican majority, ending forty years of Democratic control and reshaping House organization, campaigning and national party politics.",
        sourceUrl: "https://history.house.gov/",
        sourceLabel: "House Historian",
      },
      {
        eyebrow: "Enacted law",
        title: "Negotiated a fundamental rewrite of welfare",
        body:
          "As Speaker, Gingrich was central to the 1996 welfare reform fight that replaced Aid to Families with Dependent Children with Temporary Assistance for Needy Families and imposed new federal-state rules.",
        sourceUrl: "https://history.house.gov/",
        sourceLabel: "House Historian",
      },
      {
        eyebrow: "Enacted agreement",
        title: "Helped produce the 1997 balanced-budget deal",
        body:
          "After bitter shutdown politics, the Gingrich House and Clinton White House reached a bipartisan budget agreement pairing spending changes with tax measures—an example of confrontation eventually giving way to bargaining.",
        sourceUrl: "https://history.house.gov/",
        sourceLabel: "House Historian",
      },
    ],
  },

  "doug-collins": {
    strapline: "A pastor, military chaplain and lawyer who found an unlikely signature issue in how creators get paid.",
    summary:
      "Doug Collins' House career crossed religion, criminal justice, technology and intellectual property, but his clearest legislative fingerprint is on the modern music business. The Music Modernization Act showed how a law can matter enormously to an industry while remaining nearly invisible to everyone who simply presses play.",
    biography: [
      "Collins served as a pastor, lawyer, Georgia legislator and Air Force Reserve chaplain before entering Congress. He rose on the Judiciary Committee and became one of the House's most visible Republicans during the Trump years, eventually serving as ranking member.",
      "Away from the partisan spotlight, Collins worked with lawmakers and music-industry groups on licensing reform and later helped advance a small-claims system for copyright disputes. He left the House in 2021 after an unsuccessful Senate race and later returned to federal service as Secretary of Veterans Affairs. The arc is unusual but coherent: institutions, law and the people trying to navigate them.",
    ],
    civicQuestion:
      "How many industries depend on statutes almost none of their customers know exist?",
    achievements: [
      {
        eyebrow: "Enacted law",
        title: "Helped write the Music Modernization Act",
        body:
          "Collins was a leading House architect of the 2018 Music Modernization Act, which overhauled licensing for the streaming era and created a new system for administering digital mechanical royalties.",
        sourceUrl: "https://www.govinfo.gov/",
        sourceLabel: "Federal legislative record",
      },
      {
        eyebrow: "Enacted law",
        title: "Built a small-claims path for copyright disputes",
        body:
          "Collins helped lead the CASE Act, which created a Copyright Claims Board intended to give creators a less expensive alternative to full federal litigation for certain copyright disputes.",
        sourceUrl: "https://www.copyright.gov/about/small-claims/",
        sourceLabel: "U.S. Copyright Office",
      },
      {
        eyebrow: "Institutional role",
        title: "Led House Republicans on Judiciary",
        body:
          "As ranking member of the House Judiciary Committee, Collins became a central Republican voice on impeachment, antitrust, criminal justice and the legal boundaries of executive power.",
        sourceUrl: "https://history.house.gov/",
        sourceLabel: "House Historian",
      },
    ],
  },

  "joe-walsh": {
    strapline: "A Tea Party firebrand whose later political break became more consequential than his one term in Congress.",
    summary:
      "Joe Walsh's congressional career was short and loud. He arrived in the 2010 Tea Party wave promising confrontation over debt and spending, served one term, lost reelection—and then spent the following years undergoing a public political reversal that became its own civic story.",
    biography: [
      "Walsh represented suburban Illinois from 2011 to 2013, a period dominated by fights over the debt ceiling, deficits and the new Republican majority's relationship with President Obama. His style was intentionally insurgent. He prized ideological confrontation and became a recognizable voice of the Tea Party class even though his brief tenure left little enacted legislation bearing his name.",
      "The more unusual part of his biography came after Congress. Walsh became a conservative radio host, then an outspoken critic of Donald Trump, challenged Trump for the 2020 Republican nomination and ultimately broke with the party that had carried him to Congress. Whether one reads that as principle, evolution or political misjudgment, it raises a valuable democratic question: what does a politician owe the public when his own coalition changes—or when he changes?",
    ],
    civicQuestion:
      "Is changing your mind in public a weakness, a virtue, or simply another form of political risk?",
    recordLabel: "Congressional record & political evolution",
    achievements: [
      {
        eyebrow: "112th Congress",
        title: "Brought Tea Party fiscal politics inside the House",
        body:
          "Walsh's term was defined by the new majority's battles over federal spending, the debt ceiling and balanced-budget politics. His influence was rhetorical and coalition-based more than statutory.",
        sourceUrl: "https://history.house.gov/",
        sourceLabel: "House Historian",
      },
      {
        eyebrow: "Civic significance",
        title: "Became a prominent case of intra-party dissent",
        body:
          "After leaving Congress, Walsh's public break with Trump-era Republican politics turned him into a voice in the debate over party loyalty, democratic norms and whether political identity can be revised in public.",
        sourceUrl: "https://www.joewalsh.org/",
        sourceLabel: "Joe Walsh public biography",
      },
    ],
  },

  "george-lemieux": {
    strapline: "Sixteen months in the Senate—and a lesson in how little time a lawmaker sometimes gets.",
    summary:
      "George LeMieux served in the Senate for barely more than a year, appointed to complete Mel Martinez's Florida term. That compressed tenure makes his page unusually revealing: there is no long arc to hide behind, only the question of what a temporary senator tries to do with a clock already running.",
    biography: [
      "LeMieux arrived in September 2009 in the middle of fights over the financial crisis, health care, deficits and a still-fragile recovery. He had been a lawyer and a top adviser to Florida Governor Charlie Crist, but never before held elected federal office. By January 2011, the appointment was over.",
      "He used part of that brief window to push fiscal restraint and an earmark moratorium while also joining a bipartisan amendment with Senator Maria Cantwell aimed at reducing the financial system's mechanical dependence on credit-rating agencies. His record is modest in duration but useful in perspective: Senate seniority can take decades to accumulate, yet every senator holds the full constitutional vote from day one.",
    ],
    civicQuestion:
      "If you knew you had only sixteen months in the Senate, which fights would be worth spending them on?",
    achievements: [
      {
        eyebrow: "Senate amendment · 2010",
        title: "Challenged automatic reliance on credit-rating agencies",
        body:
          "The Senate adopted a LeMieux-Cantwell amendment during financial-regulation debate aimed at reducing statutory reliance on credit ratings and forcing institutions and regulators toward more independent due diligence.",
        sourceUrl: "https://www.govinfo.gov/content/pkg/CREC-2010-07-28/pdf/CREC-2010-07-28.pdf",
        sourceLabel: "Congressional Record",
      },
      {
        eyebrow: "Fiscal campaign",
        title: "Pushed an earmark moratorium",
        body:
          "LeMieux joined the 2010 Senate effort to impose a temporary moratorium on earmarks. The amendment failed, and his broader record on earmarks was more complicated than later campaign shorthand suggested, but the vote was part of his fiscal-reform agenda.",
        sourceUrl:
          "https://www.politifact.com/factchecks/2011/may/12/george-lemieux/emigeorge-lemieux-claims-he-never-requested-single/",
        sourceLabel: "PolitiFact record review",
      },
    ],
  },

  "anthony-weiner": {
    strapline: "A gifted political communicator whose career became a warning about the distance between public talent and private judgment.",
    summary:
      "Anthony Weiner was once one of the House's quickest debaters, a New York politician built for the age of cable television. His congressional career ended in scandal; years later he was convicted of transferring obscene material to a minor. Any serious profile has to hold the policy record and the collapse in the same frame.",
    biography: [
      "Weiner entered politics through Chuck Schumer's office, served on the New York City Council and won a House seat in 1998. He became known nationally for combative floor speeches and media appearances, often translating dense health or consumer policy into television-ready conflict.",
      "His legislative work included repeated efforts on health coverage, prescription drugs and public safety, but his career is inseparable from the conduct that ended it. He resigned from Congress in 2011 after lying about explicit online communications and was later convicted in 2017 of transferring obscene material to a minor. The point of including the full history is not spectacle. Democracy asks citizens to judge power as a whole, including the character with which it is exercised.",
    ],
    civicQuestion:
      "How should a democracy remember genuine public ability when the person who possessed it also abused trust?",
    recordLabel: "Legislation, advocacy & accountability",
    achievements: [
      {
        eyebrow: "Legislative work",
        title: "Pressed Congress on the DNA backlog",
        body:
          "Weiner introduced legislation aimed at reducing untested DNA evidence backlogs and improving the capacity of the justice system to process forensic evidence—part of a broader era of federal investment in DNA analysis.",
        sourceUrl: "https://www.govinfo.gov/",
        sourceLabel: "Federal legislative record",
      },
      {
        eyebrow: "Health-policy advocacy",
        title: "Made health coverage a central House cause",
        body:
          "Weiner was an aggressive advocate for expanding health coverage and frequently used committee hearings and floor debate to push the case for a larger public role in health insurance.",
        sourceUrl: "https://history.house.gov/People/Detail/24167",
        sourceLabel: "House Historian",
      },
      {
        eyebrow: "Accountability",
        title: "A congressional career ended by misconduct",
        body:
          "Weiner resigned in June 2011 after revelations about explicit online communications and later, in 2017, was convicted of transferring obscene material to a minor. The record is included because public biography should not edit out the breach of trust.",
        sourceUrl: "https://history.house.gov/People/Detail/24167",
        sourceLabel: "House Historian",
      },
    ],
  },

  "michael-d-brown": {
    strapline: "A senator without a Senate vote, representing citizens without full congressional representation.",
    summary:
      "Michael D. Brown's title sounds like a paradox because it is one. As a District of Columbia shadow senator, he was elected to lobby Congress for statehood and full representation but held no vote, salary, office budget or power to introduce legislation on the Senate floor. The limitation is the story.",
    biography: [
      "Brown spent decades in Democratic politics and served as one of the District's elected shadow senators, a position created to dramatize and organize around D.C.'s lack of voting representation in Congress. Shadow senators work the halls of the institution while remaining outside its formal legislative power.",
      "That makes Brown different from every voting senator on Fireside Chat. It would be misleading to invent a 'legislative achievement' list for an office constitutionally excluded from legislating. His public contribution is advocacy: keeping statehood, taxation without voting representation and the democratic status of the capital in front of national audiences. The absence of legislative power is itself evidence of the constitutional dispute he was elected to highlight.",
    ],
    civicQuestion:
      "What does representation mean when citizens can elect an advocate to Congress but not a voting member of the chamber?",
    recordLabel: "Statehood advocacy & democratic representation",
    achievements: [
      {
        eyebrow: "Elected advocacy",
        title: "Represented the statehood claim from inside the shadow delegation",
        body:
          "Brown served as a D.C. shadow senator, an elected role devoted to lobbying Congress for statehood and full representation for District residents.",
        sourceUrl: "https://bbsradio.com/shadowpolitics",
        sourceLabel: "Shadow Politics biography",
      },
      {
        eyebrow: "Constitutional context",
        title: "The office has no Senate vote—and that is precisely the point",
        body:
          "D.C. shadow senators cannot vote in the U.S. Senate or introduce legislation as senators. Fireside Chat labels that limitation explicitly rather than treating advocacy as enacted legislation.",
        sourceUrl: "https://dccouncil.gov/dc-statehood/",
        sourceLabel: "Council of the District of Columbia",
      },
    ],
  },
};

export function profileForSlug(slug: string): PersonProfile | null {
  return personProfiles[slug] ?? null;
}
