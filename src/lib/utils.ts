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

export function timeAgo(timestamp) {
  const now = Date.now();
  const then = timestamp.toMillis();
  const diff = now - then;

  const minute = 60000;
  const hour = 3600000;
  const day = 86400000;
  const week = 7 * day;

  if (diff < hour) {
    const m = Math.floor(diff / minute);
    return m <= 1 ? "1m ago" : `${m}m ago`;
  }
  if (diff < day) {
    const h = Math.floor(diff / hour);
    return h <= 1 ? "1h ago" : `${h}h ago`;
  }
  if (diff < week) {
    const d = Math.floor(diff / day);
    return d <= 1 ? "1d ago" : `${d}d ago`;
  }

  const date = timestamp.toDate();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatted = date.toLocaleDateString(undefined, options);

  // Add suffix for day (st, nd, rd, th)
  const dayNum = date.getDate();
  let suffix = "th";
  if (dayNum === 1 || dayNum === 21 || dayNum === 31) suffix = "st";
  else if (dayNum === 2 || dayNum === 22) suffix = "nd";
  else if (dayNum === 3 || dayNum === 23) suffix = "rd";

  const parts = formatted.split(" ");
  // Example: ["June", "19,", "2025"] → convert "19," to "19th,"
  parts[1] = dayNum + suffix + ",";
  return parts.join(" ");
}
