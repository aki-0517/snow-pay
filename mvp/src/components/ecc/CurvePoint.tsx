interface CurvePointProps {
	x: bigint;
	y: bigint;
	label?: string;
	onChange?: () => void;
	shouldCollapse?: boolean;
}

export function CurvePoint({ x, y, label, shouldCollapse = false }: CurvePointProps) {
	return (
		<div className="p-4 bg-cyber-dark/20 rounded-lg border border-cyber-green/20">
			{label && (
				<h4 className="text-cyber-green font-mono text-sm mb-2">{label}</h4>
			)}
			<div className="space-y-2 font-mono text-xs">
				<div className="text-gray-300">
					<span className="text-cyber-green">x:</span>{" "}
					{shouldCollapse && x.toString().length > 20
						? `${x.toString().slice(0, 10)}...${x.toString().slice(-10)}`
						: x.toString()}
				</div>
				<div className="text-gray-300">
					<span className="text-cyber-green">y:</span>{" "}
					{shouldCollapse && y.toString().length > 20
						? `${y.toString().slice(0, 10)}...${y.toString().slice(-10)}`
						: y.toString()}
				</div>
			</div>
		</div>
	);
}