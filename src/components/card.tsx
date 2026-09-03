export default function Card({
    href, image, meta, title, description,
}: {
    href: string;
    image?: string;
    meta: string[];
    title: string;
    description?: string;
}) {
    return(
        <a href={href} className="card">
            <div className="card-media">
                {image && <img src={image} alt={title} />}
            </div>
            <div className="card-body">
                <div className="card-meta">
                    {meta.map((m, i) => <span key={i}>{m}</span>)}
                </div>
                <h3>{title}</h3>
                {/* {description && <p dangerouslySetInnerHTML={{__html: description}} />} */}
                {description && <p dangerouslySetInnerHTML={{ __html: description }} suppressHydrationWarning />}

            </div>
        </a>
    )
}