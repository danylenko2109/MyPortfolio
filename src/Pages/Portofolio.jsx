import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";

const ToggleButton = ({ onClick, isShowingMore, type = 'items' }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
      focus:outline-none
      focus:ring-2
      focus:ring-purple-500/50
    "
    aria-label={`${isShowingMore ? 'Show less' : 'Show more'} ${type}`}
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "rotate-180" : ""}
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
        aria-hidden="true"
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full" />
  </button>
);

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isShowingMore: PropTypes.bool.isRequired,
  type: PropTypes.string,
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className="transition-all duration-300"
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// Константы
const LOCAL_PROJECTS = [
  {
    id: 1,
    Img: "/port.png",
    Title: "Torop Auto - Landing Page",
    Description: "A responsive landing page built with HTML, SCSS, featuring a clean layout and optimized performance.",
    Link: "https://toropauto.de/"
  },
  {
    id: 2,
    Img: "/port2.png",
    Title: "Landing Page",
    Description: "A responsive landing page built with HTML, SCSS, and Gulp, featuring a clean layout and optimized performance.",
    Link: "https://diannestudioo.vercel.app/"
  },
  {
    id: 3,
    Img: "/port3.png",
    Title: "Questly - Social Media",
    Description: "Questly is a full-stack social media platform built with React, Redux, and SCSS on the frontend, and Node.js with Express on the backend. It connects to RESTful APIs for real-time data exchange, enabling authentication, post management, and interactive social features within a fully responsive UI.",
    Link: "https://questly-client21.vercel.app/"
  },
  {
    id: 4,
    Img: "/port4.png",
    Title: "Weather Dashboard",
    Description: "Weather application with location-based forecasts and interactive charts",
    Link: "https://euphoria-fqi8.vercel.app/"
  }
];

const LOCAL_CERTIFICATES = [
  {
    id: 1,
    Img: "/certificate.png",
    Title: "Frontend Developer Certificate"
  }
];

const TECH_STACKS = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
];

const AOS_ANIMATIONS = {
  0: { animation: "fade-up-right", duration: "1000" },
  1: { animation: "fade-up", duration: "1200" },
  2: { animation: "fade-up-left", duration: "1000" }
};

export default function PortfolioTabs() {
  const [value, setValue] = useState(0);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      offset: 100,
    });

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTouchStart = useCallback((e) => {
    if (!isMobile) return;
    setTouchStart(e.targetTouches[0].clientX);
  }, [isMobile]);

  const handleTouchMove = useCallback((e) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) < minSwipeDistance) return;
    
    if (distance > 0) {
      // Свайп влево - следующая вкладка
      setValue(prev => Math.min(2, prev + 1));
    } else {
      // Свайп вправо - предыдущая вкладка
      setValue(prev => Math.max(0, prev - 1));
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  }, [isMobile, touchStart, touchEnd]);

  const toggleShowMore = (type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  };

  const initialItems = isMobile ? 4 : 6;
  
  const displayedProjects = showAllProjects ? LOCAL_PROJECTS : LOCAL_PROJECTS.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? LOCAL_CERTIFICATES : LOCAL_CERTIFICATES.slice(0, initialItems);

  const getAnimationProps = (index) => {
    const animationType = AOS_ANIMATIONS[index % 3];
    return {
      "data-aos": animationType.animation,
      "data-aos-duration": animationType.duration
    };
  };

  return (
    <div 
      className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" 
      id="portfolio"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header section */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="800">
        <h2 className="text-3xl md:text-5xl font-bold text-center mx-auto">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise. 
          Each section represents a milestone in my continuous learning path.
        </p>
        {isMobile && (
          <p className="text-slate-500 text-xs mt-2">Swipe left/right to switch tabs</p>
        )}
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              iconPosition="start"
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              iconPosition="start"
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              iconPosition="start"
              label="Tech Stack"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        {/* Tab Panels */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${value * 100}%)` }}
          >
            {/* Projects Tab */}
            <div className="w-full flex-shrink-0">
              <TabPanel value={value} index={0}>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                    {displayedProjects.map((project, index) => (
                      <div
                        key={project.id}
                        {...getAnimationProps(index)}
                      >
                        <CardProject
                          Img={project.Img}
                          Title={project.Title}
                          Description={project.Description}
                          Link={project.Link}
                          id={project.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {LOCAL_PROJECTS.length > initialItems && (
                  <div className="mt-6 w-full flex justify-start">
                    <ToggleButton
                      onClick={() => toggleShowMore('projects')}
                      isShowingMore={showAllProjects}
                      type="projects"
                    />
                  </div>
                )}
              </TabPanel>
            </div>

            {/* Certificates Tab */}
            <div className="w-full flex-shrink-0">
              <TabPanel value={value} index={1}>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {displayedCertificates.map((certificate, index) => (
                      <div
                        key={certificate.id}
                        {...getAnimationProps(index)}
                      >
                        <Certificate 
                          ImgSertif={certificate.Img} 
                          title={certificate.Title}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {LOCAL_CERTIFICATES.length > initialItems && (
                  <div className="mt-6 w-full flex justify-center md:justify-start">
                    <ToggleButton
                      onClick={() => toggleShowMore('certificates')}
                      isShowingMore={showAllCertificates}
                      type="certificates"
                    />
                  </div>
                )}
              </TabPanel>
            </div>

            {/* Tech Stack Tab */}
            <div className="w-full flex-shrink-0">
              <TabPanel value={value} index={2}>
                <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-8">
                    {TECH_STACKS.map((stack, index) => (
                      <div
                        key={`${stack.language}-${index}`}
                        {...getAnimationProps(index)}
                      >
                        <TechStackIcon 
                          TechStackIcon={stack.icon} 
                          Language={stack.language} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabPanel>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}