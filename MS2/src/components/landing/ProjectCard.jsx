import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
BookOpen,
Eye,
PlayCircle,
} from "lucide-react";

export default function ProjectCard({ project , index }) {
return (
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, rotateX: 3, rotateY: -3 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
            >
                <Card className="overflow-hidden rounded-[30px] border-white/80 bg-white/70 shadow-[0_24px_70px_rgba(53,88,114,0.13)] backdrop-blur-2xl">
                <div className="h-44 bg-[linear-gradient(135deg,#2C3947,#355872_45%,#7AAACE)] p-5">
                    <div className="flex h-full flex-col justify-between rounded-3xl border border-white/20 bg-white/10 p-4">
                    <div>
                        <div className="mb-3 h-3 w-24 rounded-full bg-white/45" />
                        <div className="mb-2 h-3 w-36 rounded-full bg-white/30" />
                        <div className="mb-2 h-3 w-28 rounded-full bg-white/25" />
                    </div>

                    <div className="flex items-center gap-2 text-white/80">
                        <PlayCircle className="h-5 w-5" />
                        <BookOpen className="h-5 w-5" />
                        <Eye className="h-5 w-5" />
                    </div>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-[#9CD5FF]/25 px-3 py-1 text-xs font-black text-[#355872]">
                        {project.type}
                    </span>
                    <span className="text-xs font-black text-[#7B8794]">
                        {project.tag}
                    </span>
                    </div>

                    <h3 className="text-xl font-black text-[#102630]">
                    {project.title}
                    </h3>

                <p className="mt-2 text-sm leading-6 text-[#7B8794]">
                    {project.desc}
                </p>
                </CardContent>
                </Card>
            </motion.div>
);
}