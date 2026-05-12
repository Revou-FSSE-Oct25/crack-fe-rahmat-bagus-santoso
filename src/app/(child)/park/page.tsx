import { RideIcon } from "@/components/park/RideIcon";
import { Castle } from "lucide-react";

export default function ParkMapPage() {
    return (
        <div className="relative w-full h-screen bg-park-sky overflow-hidden">
            {/* park patern */} 
            <div className="absolute inset-0 opacity-20 pointer-events-none">

            </div>
            <h1 className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl font-bold text-park-ocean drop-shadow-sm">
                The Learning Park
            </h1>
            <RideIcon id="m1" title="Colors Palace" icon="Castle" top="30%" left="25%" />
            <RideIcon id="m2" title="Numbers Carousel" icon="numbers" top="60%" left="50%" />
            <RideIcon id="m3" title="Alphabets Cage" icon="alphabet" top="40%" left="75%" />
        </div>
        
    )
}