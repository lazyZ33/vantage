export default function ServiceRow({ idx, title, tags}: { idx: string; title: string; tags: string[]  }){
    return(
        <div className="service-row">
            <span className="idx">{idx}</span>
            <h3>{title}</h3>
            <div className="tags">
                {tags.map((tags, i) => <span key={i} className="tag">{tags.trim()}</span>)}
            </div>
        </div>
    );
}