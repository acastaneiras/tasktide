export default function Layout(
    { children }: { children: React.ReactNode }
) {
    return (
        <div className="bg-gradient-to-br from-background to-muted flex h-screen w-screen flex-col items-center justify-centerd">
            <div className="container mx-auto flex flex-col items-center justify-center h-full">
                {children}
            </div>
        </div>
    );
}