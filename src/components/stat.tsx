export default function Stat({number, label}: {number:string; label:string}){
    return (
        <div className="stat">
            <div className="num">{number}</div>
            <div className="lbl">{label}</div>
        </div>
    );
}