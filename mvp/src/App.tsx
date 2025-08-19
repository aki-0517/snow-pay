import { Suspense, lazy } from "react";
import { Logo } from "./components/layout/Logo";
import { WalletButton } from "./components/layout/WalletButton";

// Lazy load page components
const SnowPay = lazy(() =>
	import("./pages/SnowPay").then((module) => ({ default: module.SnowPay })),
);

// Loading component
const LoadingFallback = () => (
	<div className="flex items-center justify-center h-64">
		<div className="text-snow-gray">Loading...</div>
	</div>
);

export function App() {
	return (
		<div className="min-h-screen bg-snow-light">
			{/* Header */}
			<header className="bg-snow-bg shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Logo />
						<WalletButton />
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Suspense fallback={<LoadingFallback />}>
					<SnowPay />
				</Suspense>
			</main>
		</div>
	);
}

export default App;
