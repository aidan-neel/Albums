export function clickOutside(node: Node, callback: () => any, exclude: Node[] = []) {
	const handleClick = (event: MouseEvent) => {
		if (
			node &&
			!node.contains(event.target as Node) &&
			!exclude.some((excludeNode) => excludeNode.contains(event.target as Node))
		) {
			callback();
		}
	};

	// Delay adding the event listener to prevent it from firing immediately on open
	setTimeout(() => {
		document.addEventListener('click', handleClick, true);
	}, 0);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}