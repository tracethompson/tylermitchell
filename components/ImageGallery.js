import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";


function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  return windowSize
}

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export default function ImageGallery({images, page, direction, setPage, paginate}) {
  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  
  
  useEffect(() => {
    function onKeyup(e) {
      if (e.key === 'ArrowRight') {
        paginate(1)
      }

      if (e.key === 'ArrowUp') {
        paginate(1)
      }

      if (e.key === 'ArrowLeft') {
        paginate(-1)
      }

      if (e.key === 'ArrowDown') {
        paginate(-1)
      }
    }
    window.addEventListener('keyup', onKeyup)
    return () => window.removeEventListener('keyup', onKeyup)
  }, [page])

  const { width } = useWindowSize()
  const notMobile = width > 850

  if (notMobile) {
    let imageIndex = wrap(0, images.length, page)
    const chunk = images[imageIndex]
    if (chunk.length > 1) {
      return (
        <div className="flex flex-row w-full h-full content-center items-center" onClick={handleClick}>
          <div className="w-1/2 h-full pr-4 flex items-center content-center">
            <img className="max-h-full ml-auto" src={chunk[0]}/>
          </div>
          <div className="w-1/2 h-full pl-4 flex items-center content-center">
            <img className="max-h-full mr-auto" src={chunk[1]}/>
          </div>
        </div>
      )
    }
    return (
      <img
        className="max-h-full mx-auto"
        src={chunk[0]}
      />
    )
  }
  const flatImages = images.flat()
  let imageIndex = wrap(0, flatImages.length, page);

  const handleClick = e => {
    const target = e?.nativeEvent?.offsetX || e?.offsetX
    const center = e?.target?.clientWidth / 2
    if (target < center) {
      paginate(-1)
    } else {
      paginate(1)
    }
  }

  return (
    <div className="relative left-0 w-full max-h-full h-full">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={flatImages[imageIndex]}
          className="mobile__image"
          variants={variants}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          onClick={handleClick}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          transition={{
            x: { type: "spring", stiffness: 800, damping: 50 },
            opacity: { duration: 0.2 }
          }}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>
    </div>
  );
};
