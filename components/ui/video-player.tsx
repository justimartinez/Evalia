"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  description?: string
}

export function VideoPlayer({ src, poster, title, description }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-xl overflow-hidden shadow-xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-50"></div>
      <div className="relative rounded-xl overflow-hidden">
        <video ref={videoRef} className="w-full aspect-video object-cover" poster={poster} onClick={togglePlay}>
          <source src={src} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>

        {/* Overlay con información */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/60 to-red-900/60 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white/10 p-8 rounded-xl text-center max-w-md backdrop-blur-md border border-white/20">
              {title && <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>}
              {description && <p className="text-blue-100 mb-6">{description}</p>}
              <Button
                onClick={togglePlay}
                className="bg-orange-500 hover:bg-orange-600 group transition-all duration-300"
              >
                <Play className="h-5 w-5 mr-2" /> Ver video
              </Button>
            </div>
          </div>
        )}

        {/* Controles de video */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
        >
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
