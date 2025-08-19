import { Suspense, lazy } from "react";
import { Logo } from "./components/layout/Logo";

// Lazy load page components
const EERC = lazy(() =>
	import("./pages/EERC").then((module) => ({ default: module.EERC })),
);

// Loading component
const LoadingFallback = () => (
	<div className="flex items-center justify-center h-full">
		<div className="text-cyber-green font-mono">Loading...</div>
	</div>
);

export function App() {
	return (
		<div className="flex min-h-screen bg-gray-100">
			<nav className="sticky top-0 w-64 bg-cyber-dark text-white flex flex-col p-2 h-screen">
				<div className="p-4 font-bold text-lg flex justify-center items-center">
					<Logo />
				</div>
				<ul className="flex-grow space-y-2 p-4">
					<li>
						<p className="block px-4 py-2 rounded text-center text-cyber-green font-mono">
							eERC
						</p>
					</li>
				</ul>
			</nav>

			{/* Page Content */}
			<main className="flex-grow p-6 bg-cyber-black">
				<Suspense fallback={<LoadingFallback />}>
					<EERC />
				</Suspense>
			</main>
		</div>
	);
}

export default App;
