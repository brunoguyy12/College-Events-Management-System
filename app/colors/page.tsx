const Page = () => {
    return ( 
        <div className="flex flex-row items-center justify-center h-screen space-x-4">
            <div className="flex flex-col space-y-4">
                <h1>Colors - 50</h1>
                <div className="w-36 h-36 bg-primary-50"></div>
                <div className="w-36 h-36 bg-secondary-50"></div>
                <div className="w-36 h-36 bg-accent-50"></div>
            </div>
            <div className="flex flex-col space-y-4">
                <h1>Colors - 500</h1>
                <div className="w-36 h-36 flex justify-center items-center bg-primary-500 text-black">Primary</div>
                <div className="w-36 h-36 flex justify-center items-center bg-secondary-500 text-black">Secondary</div>
                <div className="w-36 h-36 flex justify-center items-center bg-accent-500 text-black">Accent</div>
            </div>
            <div className="flex flex-col space-y-4">
                <h1>Colors - 800</h1>
                <div className="w-36 h-36 bg-primary-800"></div>
                <div className="w-36 h-36 bg-secondary-800"></div>
                <div className="w-36 h-36 bg-accent-800"></div>
            </div>

            <div className="flex flex-col space-y-4">
                <h1>ShadcN normal Colors</h1>
                <div className="w-36 h-36 bg-background-500"></div>
                <div className="w-36 h-36 bg-foreground"></div>
                <div className="w-36 h-36 bg-text-500"></div>
            </div>
        </div>
     );
}
 
export default Page;