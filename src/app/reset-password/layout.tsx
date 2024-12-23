export default function Layout(
    { children }: { children: React.ReactNode }
) {
    return (
        <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
            {children}
        </div>
    )
}