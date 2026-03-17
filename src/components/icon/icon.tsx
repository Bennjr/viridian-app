export default function Icon({
    src = "",
    size = "w-6 h-6",
    color = "bg-c-text",
    className = ""
}) {
    return (
        <div
            className={`${size} ${color} inline-block ${className}`}
            style={{
                WebkitMask: `url('${src}') no-repeat center / contain`,
                mask: `url('${src}') no-repeat center / contain`
            }}
        />
    );
}