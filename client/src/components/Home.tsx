import RetroGrid from './magicui/retro-grid'

function Home() {
    return (
        <>
            <div className="home-wrapper">
                <span className="pointer-events-none py-4 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
                    Ezybuy
                </span>
                <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-2xl font-bold leading-none tracking-tighter text-transparent">
                    Where Makers and Tech Enthusiasts Find Their Tools
                </span>
                <RetroGrid />
            </div>
        </>
    )
}

export default Home