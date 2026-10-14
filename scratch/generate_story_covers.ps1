Add-Type -AssemblyName System.Drawing

function Draw-Cover {
    param(
        [string]$Filename,
        [scriptblock]$DrawAction
    )
    $w = 800
    $h = 500
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    & $DrawAction $g $w $h

    $webPath = "apps\web\public\assets\phonics\$Filename"
    $tvPath = "apps\tv\src\assets\phonics\$Filename"
    
    $bmp.Save($webPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Save($tvPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $Filename"
}

# ─────────────────────────────────────────────────────────────
# 1. zack-black-duck.jpg
# ─────────────────────────────────────────────────────────────
Draw-Cover "zack-black-duck.jpg" {
    param($g, $w, $h)
    $sky = New-Object System.Drawing.Rectangle(0, 0, $w, 280)
    $skyB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($sky, [System.Drawing.Color]::FromArgb(204, 251, 241), [System.Drawing.Color]::FromArgb(153, 246, 228), 90.0)
    $g.FillRectangle($skyB, $sky)

    $sunB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 240, 138))
    $g.FillEllipse($sunB, 660, 40, 90, 90)

    $pond = New-Object System.Drawing.Rectangle(0, 240, $w, 260)
    $pondB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pond, [System.Drawing.Color]::FromArgb(45, 212, 191), [System.Drawing.Color]::FromArgb(15, 118, 110), 90.0)
    $g.FillRectangle($pondB, $pond)

    $grassB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(34, 197, 94))
    $g.FillEllipse($grassB, -120, 220, 450, 320)

    $rockB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 163, 184))
    $g.FillEllipse($rockB, 430, 330, 280, 110)
    $darkRockB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 116, 139))
    $g.FillEllipse($darkRockB, 460, 360, 220, 70)

    # Duck Chuck
    $duckB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
    $g.FillEllipse($duckB, 510, 240, 140, 110)
    $g.FillEllipse($duckB, 590, 180, 80, 80)
    
    $whiteB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($whiteB, 630, 195, 20, 20)
    $blackB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $g.FillEllipse($blackB, 638, 201, 10, 10)
    
    $beakB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(249, 115, 22))
    $pts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(660, 215),
        [System.Drawing.Point]::new(725, 225),
        [System.Drawing.Point]::new(660, 245)
    )
    $g.FillPolygon($beakB, $pts)

    $wingB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(51, 65, 85))
    $g.FillEllipse($wingB, 520, 260, 85, 55)

    # Zack
    $pantsB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235))
    $g.FillRectangle($pantsB, 135, 290, 25, 80)
    $g.FillRectangle($pantsB, 170, 290, 25, 80)
    $shirtB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(234, 179, 8))
    $g.FillRectangle($shirtB, 125, 200, 75, 95)
    $packB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(239, 68, 68))
    $g.FillRectangle($packB, 95, 205, 34, 75)
    $skinB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 215, 170))
    $g.FillEllipse($skinB, 135, 120, 60, 68)
    $hairB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 53, 15))
    $g.FillEllipse($hairB, 130, 110, 70, 40)
    $g.FillEllipse($blackB, 160, 145, 6, 6)
    $g.FillEllipse($blackB, 175, 145, 6, 6)
    $smilePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 83, 9), 2)
    $g.DrawArc($smilePen, 160, 158, 20, 12, 0, 180)

    $g.FillRectangle($shirtB, 180, 210, 50, 20)
    $g.FillEllipse($skinB, 225, 210, 20, 20)
    $crumbB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 191, 36))
    $g.FillEllipse($crumbB, 280, 230, 10, 10)
    $g.FillEllipse($crumbB, 360, 245, 10, 10)
    $g.FillEllipse($crumbB, 440, 255, 8, 8)

    $ribbonB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 13, 148, 136))
    $g.FillRectangle($ribbonB, 0, 0, $w, 56)
    $titleF = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Zack and Chuck the Black Duck", $titleF, $whiteB, 24, 12)
    $badgeF = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
    $badgeB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 240, 138))
    $g.DrawString("Digraph -ck - Short Vowels", $badgeF, $badgeB, 550, 18)
}

# ─────────────────────────────────────────────────────────────
# 2. queen-green-bee.jpg
# ─────────────────────────────────────────────────────────────
Draw-Cover "queen-green-bee.jpg" {
    param($g, $w, $h)
    $sky = New-Object System.Drawing.Rectangle(0, 0, $w, 320)
    $skyB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($sky, [System.Drawing.Color]::FromArgb(236, 253, 245), [System.Drawing.Color]::FromArgb(167, 243, 208), 90.0)
    $g.FillRectangle($skyB, $sky)

    $hillB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(52, 211, 153))
    $g.FillEllipse($hillB, 300, 180, 600, 400)
    $grassB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 185, 129))
    $g.FillRectangle($grassB, 0, 280, $w, 220)

    $trunkB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 53, 15))
    $g.FillRectangle($trunkB, 80, 150, 60, 250)
    $leavesB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(5, 150, 105))
    $g.FillEllipse($leavesB, 10, 40, 200, 180)
    $darkLeavesB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(4, 120, 87))
    $g.FillEllipse($darkLeavesB, 50, 70, 150, 130)

    # Queen Jean
    $gownB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 185, 129))
    $gownPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(230, 240),
        [System.Drawing.Point]::new(170, 420),
        [System.Drawing.Point]::new(310, 420)
    )
    $g.FillPolygon($gownB, $gownPts)

    $skinB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 215, 170))
    $g.FillEllipse($skinB, 215, 150, 50, 58)
    $hairB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 83, 9))
    $g.FillEllipse($hairB, 210, 142, 60, 40)
    
    $goldB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 191, 36))
    $crownPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(220, 145),
        [System.Drawing.Point]::new(220, 120),
        [System.Drawing.Point]::new(230, 135),
        [System.Drawing.Point]::new(240, 115),
        [System.Drawing.Point]::new(250, 135),
        [System.Drawing.Point]::new(260, 120),
        [System.Drawing.Point]::new(260, 145)
    )
    $g.FillPolygon($goldB, $crownPts)

    # Teacup
    $cupB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillRectangle($cupB, 275, 270, 30, 24)
    $g.FillEllipse($cupB, 275, 285, 30, 14)
    $teaPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(245, 158, 11), 2)
    $g.DrawArc($teaPen, 280, 250, 10, 15, 0, 180)

    # Green Bee
    $beeB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 185, 129))
    $g.FillEllipse($beeB, 480, 190, 80, 55)
    $stripeB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 191, 36))
    $g.FillRectangle($stripeB, 505, 191, 12, 53)
    $g.FillRectangle($stripeB, 525, 193, 12, 49)
    $beeHeadB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(4, 120, 87))
    $g.FillEllipse($beeHeadB, 460, 200, 38, 38)
    $wingB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 255, 255, 255))
    $g.FillEllipse($wingB, 490, 145, 45, 55)
    $g.FillEllipse($wingB, 515, 150, 45, 50)
    $whiteB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($whiteB, 468, 208, 12, 12)
    $blackB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $g.FillEllipse($blackB, 471, 212, 6, 6)

    $ribbonB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 5, 150, 105))
    $g.FillRectangle($ribbonB, 0, 0, $w, 56)
    $titleF = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("The Queen and the Green Bee", $titleF, $whiteB, 24, 12)
    $badgeF = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Vowel Teams ee, ea - Long E", $badgeF, $goldB, 540, 18)
}

# ─────────────────────────────────────────────────────────────
# 3. goat-yellow-boat.jpg
# ─────────────────────────────────────────────────────────────
Draw-Cover "goat-yellow-boat.jpg" {
    param($g, $w, $h)
    $sky = New-Object System.Drawing.Rectangle(0, 0, $w, 260)
    $skyB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($sky, [System.Drawing.Color]::FromArgb(254, 215, 170), [System.Drawing.Color]::FromArgb(253, 186, 116), 90.0)
    $g.FillRectangle($skyB, $sky)

    $sunB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 146, 60))
    $g.FillEllipse($sunB, 340, 60, 120, 120)

    $river = New-Object System.Drawing.Rectangle(0, 240, $w, 260)
    $riverB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($river, [System.Drawing.Color]::FromArgb(96, 165, 250), [System.Drawing.Color]::FromArgb(30, 64, 175), 90.0)
    $g.FillRectangle($riverB, $river)

    $hillB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 83, 9))
    $g.FillEllipse($hillB, -80, 180, 480, 200)
    $g.FillEllipse($hillB, 460, 190, 450, 190)

    # Yellow Boat
    $boatB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 204, 21))
    $boatPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(200, 340),
        [System.Drawing.Point]::new(620, 340),
        [System.Drawing.Point]::new(540, 430),
        [System.Drawing.Point]::new(280, 430)
    )
    $g.FillPolygon($boatB, $boatPts)

    $rimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(202, 138, 4), 6)
    $g.DrawLine($rimPen, 190, 340, 630, 340)

    # Goat Flo
    $coatB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 38, 38))
    $g.FillRectangle($coatB, 340, 240, 90, 105)
    $whiteB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($whiteB, 360, 160, 75, 85)
    $earB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(241, 245, 249))
    $g.FillEllipse($earB, 340, 185, 28, 50)
    $g.FillEllipse($earB, 425, 185, 28, 50)
    $hornB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(217, 119, 6))
    $g.FillEllipse($hornB, 375, 140, 14, 30)
    $g.FillEllipse($hornB, 405, 140, 14, 30)
    $blackB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $g.FillEllipse($blackB, 380, 185, 8, 8)
    $g.FillEllipse($blackB, 405, 185, 8, 8)
    $noseB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(244, 114, 182))
    $g.FillEllipse($noseB, 390, 205, 14, 10)

    # Toad
    $toadB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 53, 15))
    $g.FillEllipse($toadB, 510, 295, 60, 48)
    $g.FillEllipse($whiteB, 520, 285, 16, 16)
    $g.FillEllipse($whiteB, 545, 285, 16, 16)
    $g.FillEllipse($blackB, 525, 290, 8, 8)
    $g.FillEllipse($blackB, 550, 290, 8, 8)

    $ripplePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(191, 219, 254), 3)
    $g.DrawArc($ripplePen, 160, 420, 120, 20, 0, 180)
    $g.DrawArc($ripplePen, 480, 435, 160, 25, 0, 180)

    $ribbonB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 234, 88, 12))
    $g.FillRectangle($ribbonB, 0, 0, $w, 56)
    $titleF = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("The Goat in a Yellow Boat", $titleF, $whiteB, 24, 12)
    $badgeF = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
    $goldB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 240, 138))
    $g.DrawString("Vowel Teams oa, ow - Long O", $badgeF, $goldB, 540, 18)
}

# ─────────────────────────────────────────────────────────────
# 4. king-shiny-ring.jpg
# ─────────────────────────────────────────────────────────────
Draw-Cover "king-shiny-ring.jpg" {
    param($g, $w, $h)
    $sky = New-Object System.Drawing.Rectangle(0, 0, $w, 280)
    $skyB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($sky, [System.Drawing.Color]::FromArgb(243, 232, 255), [System.Drawing.Color]::FromArgb(216, 180, 254), 90.0)
    $g.FillRectangle($skyB, $sky)

    $wall = New-Object System.Drawing.Rectangle(0, 260, $w, 240)
    $wallB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($wall, [System.Drawing.Color]::FromArgb(147, 51, 234), [System.Drawing.Color]::FromArgb(88, 28, 135), 90.0)
    $g.FillRectangle($wallB, $wall)

    $turretB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(192, 132, 252))
    $g.FillRectangle($turretB, 80, 140, 90, 150)
    $g.FillRectangle($turretB, 640, 130, 90, 160)
    
    $coneB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(126, 34, 206))
    $conePts1 = [System.Drawing.Point[]]@([System.Drawing.Point]::new(70, 140), [System.Drawing.Point]::new(125, 60), [System.Drawing.Point]::new(180, 140))
    $conePts2 = [System.Drawing.Point[]]@([System.Drawing.Point]::new(630, 130), [System.Drawing.Point]::new(685, 50), [System.Drawing.Point]::new(740, 130))
    $g.FillPolygon($coneB, $conePts1)
    $g.FillPolygon($coneB, $conePts2)

    # King Ming
    $robeB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(107, 33, 168))
    $g.FillRectangle($robeB, 320, 220, 160, 200)
    $capeB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 38, 38))
    $g.FillRectangle($capeB, 290, 230, 35, 180)
    $g.FillRectangle($capeB, 475, 230, 35, 180)

    $skinB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 215, 170))
    $g.FillEllipse($skinB, 360, 130, 80, 95)
    $beardB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 53, 15))
    $g.FillEllipse($beardB, 360, 180, 80, 60)
    $g.FillEllipse($skinB, 370, 160, 60, 50)
    
    $blackB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $g.FillEllipse($blackB, 385, 175, 8, 8)
    $g.FillEllipse($blackB, 410, 175, 8, 8)
    $smileP = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 83, 9), 3)
    $g.DrawArc($smileP, 388, 190, 24, 15, 0, 180)

    $goldB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 191, 36))
    $crownPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(350, 140),
        [System.Drawing.Point]::new(350, 90),
        [System.Drawing.Point]::new(375, 115),
        [System.Drawing.Point]::new(400, 80),
        [System.Drawing.Point]::new(425, 115),
        [System.Drawing.Point]::new(450, 90),
        [System.Drawing.Point]::new(450, 140)
    )
    $g.FillPolygon($goldB, $crownPts)

    # Hand with Ring
    $g.FillRectangle($robeB, 440, 250, 80, 30)
    $g.FillEllipse($skinB, 510, 245, 35, 35)
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(251, 191, 36), 6)
    $g.DrawEllipse($ringPen, 520, 235, 26, 26)
    $gemB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248))
    $g.FillEllipse($gemB, 527, 226, 14, 14)

    # Bird
    $birdB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(14, 165, 233))
    $g.FillEllipse($birdB, 220, 230, 60, 45)
    $g.FillEllipse($birdB, 205, 215, 32, 32)
    $beakB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(249, 115, 22))
    $birdBeak = [System.Drawing.Point[]]@([System.Drawing.Point]::new(205, 225), [System.Drawing.Point]::new(185, 230), [System.Drawing.Point]::new(205, 235))
    $g.FillPolygon($beakB, $birdBeak)

    $ribbonB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 126, 34, 206))
    $g.FillRectangle($ribbonB, 0, 0, $w, 56)
    $whiteB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $titleF = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("The King with a Shiny Ring", $titleF, $whiteB, 24, 12)
    $badgeF = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Glued Sounds -ing - Grade 1", $badgeF, $goldB, 540, 18)
}

# ─────────────────────────────────────────────────────────────
# 5. rain-on-train.jpg
# ─────────────────────────────────────────────────────────────
Draw-Cover "rain-on-train.jpg" {
    param($g, $w, $h)
    $sky = New-Object System.Drawing.Rectangle(0, 0, $w, 240)
    $skyB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($sky, [System.Drawing.Color]::FromArgb(148, 163, 184), [System.Drawing.Color]::FromArgb(203, 213, 225), 90.0)
    $g.FillRectangle($skyB, $sky)

    $bay = New-Object System.Drawing.Rectangle(0, 220, $w, 140)
    $bayB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bay, [System.Drawing.Color]::FromArgb(59, 130, 246), [System.Drawing.Color]::FromArgb(29, 78, 216), 90.0)
    $g.FillRectangle($bayB, $bay)

    $whiteB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $sailPts = [System.Drawing.Point[]]@([System.Drawing.Point]::new(620, 260), [System.Drawing.Point]::new(620, 205), [System.Drawing.Point]::new(655, 255))
    $g.FillPolygon($whiteB, $sailPts)
    $hullB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(185, 28, 28))
    $g.FillRectangle($hullB, 605, 260, 55, 14)

    $groundB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(71, 85, 105))
    $g.FillRectangle($groundB, 0, 340, $w, 160)
    $railPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 6)
    $g.DrawLine($railPen, 0, 440, $w, 440)
    $g.DrawLine($railPen, 0, 465, $w, 465)

    # Train
    $trainB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(226, 232, 240))
    $g.FillRectangle($trainB, 60, 260, 680, 150)
    $g.FillPie($trainB, 620, 260, 150, 150, 270, 180)
    $stripeB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235))
    $g.FillRectangle($stripeB, 60, 345, 690, 24)

    $winB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248))
    $g.FillRectangle($winB, 120, 280, 100, 55)
    $g.FillRectangle($winB, 260, 280, 100, 55)
    $g.FillRectangle($winB, 400, 280, 100, 55)
    $g.FillRectangle($winB, 540, 280, 100, 55)

    # Boy Ray
    $skinB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 215, 170))
    $g.FillEllipse($skinB, 290, 285, 40, 45)
    $hairB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 53, 15))
    $g.FillEllipse($hairB, 285, 280, 48, 25)
    $blackB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $g.FillEllipse($blackB, 305, 298, 5, 5)
    $g.FillEllipse($blackB, 318, 298, 5, 5)
    $g.FillEllipse($skinB, 335, 290, 16, 18)

    $rainPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 255, 255, 255), 2)
    for ($i = 0; $i -lt 40; $i++) {
        $rx = (Get-Random -Minimum 20 -Maximum 780)
        $ry = (Get-Random -Minimum 40 -Maximum 420)
        $g.DrawLine($rainPen, $rx, $ry, $rx + 10, $ry + 22)
    }

    $ribbonB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 37, 99, 235))
    $g.FillRectangle($ribbonB, 0, 0, $w, 56)
    $titleF = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Ray and the Rain on the Train", $titleF, $whiteB, 24, 12)
    $badgeF = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
    $goldB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 240, 138))
    $g.DrawString("Vowel Teams ai, ay - Long A", $badgeF, $goldB, 540, 18)
}

# ─────────────────────────────────────────────────────────────
# 6. mark-spark-barn.jpg
# ─────────────────────────────────────────────────────────────
Draw-Cover "mark-spark-barn.jpg" {
    param($g, $w, $h)
    $sky = New-Object System.Drawing.Rectangle(0, 0, $w, 320)
    $skyB = New-Object System.Drawing.Drawing2D.LinearGradientBrush($sky, [System.Drawing.Color]::FromArgb(15, 23, 42), [System.Drawing.Color]::FromArgb(30, 41, 59), 90.0)
    $g.FillRectangle($skyB, $sky)

    $starB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 240, 138))
    $whiteB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    for ($i = 0; $i -lt 30; $i++) {
        $sx = (Get-Random -Minimum 30 -Maximum 770)
        $sy = (Get-Random -Minimum 40 -Maximum 220)
        $g.FillEllipse($whiteB, $sx, $sy, 4, 4)
    }
    $g.FillEllipse($starB, 680, 50, 20, 20)
    $starP = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(254, 240, 138), 3)
    $g.DrawLine($starP, 690, 35, 690, 85)
    $g.DrawLine($starP, 665, 60, 715, 60)

    $groundB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 83, 45))
    $g.FillRectangle($groundB, 0, 300, $w, 200)

    # Red Barn
    $barnB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(185, 28, 28))
    $g.FillRectangle($barnB, 80, 160, 280, 190)
    $roofB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(127, 29, 29))
    $roofPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(50, 160),
        [System.Drawing.Point]::new(220, 70),
        [System.Drawing.Point]::new(390, 160)
    )
    $g.FillPolygon($roofB, $roofPts)
    $doorB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(69, 10, 10))
    $g.FillRectangle($doorB, 180, 230, 90, 120)
    $crossPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 4)
    $g.DrawRectangle($crossPen, 180, 230, 90, 120)
    $g.DrawLine($crossPen, 180, 230, 270, 350)
    $g.DrawLine($crossPen, 270, 230, 180, 350)

    # Mark & Flashlight
    $pantsB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 58, 138))
    $g.FillRectangle($pantsB, 430, 310, 22, 85)
    $g.FillRectangle($pantsB, 460, 310, 22, 85)
    $coatB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(217, 119, 6))
    $g.FillRectangle($coatB, 420, 220, 70, 95)
    $skinB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 215, 170))
    $g.FillEllipse($skinB, 430, 150, 52, 60)
    $hatB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 53, 15))
    $g.FillEllipse($hatB, 420, 140, 70, 32)
    
    $beamB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 254, 240, 138))
    $beamPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(485, 255),
        [System.Drawing.Point]::new(740, 230),
        [System.Drawing.Point]::new(740, 420)
    )
    $g.FillPolygon($beamB, $beamPts)

    # Dog Spark
    $dogB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 83, 9))
    $g.FillEllipse($dogB, 500, 320, 95, 60)
    $g.FillEllipse($dogB, 565, 280, 55, 50)
    $earPts1 = [System.Drawing.Point[]]@([System.Drawing.Point]::new(575, 285), [System.Drawing.Point]::new(585, 255), [System.Drawing.Point]::new(595, 285))
    $g.FillPolygon($dogB, $earPts1)
    $blackB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $g.FillEllipse($blackB, 600, 295, 8, 8)
    $g.FillEllipse($blackB, 615, 305, 10, 8)

    # Cart with Chick
    $cartB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(146, 64, 14))
    $g.FillRectangle($cartB, 640, 330, 110, 55)
    $wheelPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 53, 15), 6)
    $g.DrawEllipse($wheelPen, 675, 360, 45, 45)
    $chickB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 204, 21))
    $g.FillEllipse($chickB, 680, 310, 28, 26)
    $g.FillEllipse($chickB, 695, 302, 18, 18)

    $ribbonB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 180, 83, 9))
    $g.FillRectangle($ribbonB, 0, 0, $w, 56)
    $titleF = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Mark and Spark in the Dark Barn", $titleF, $whiteB, 24, 12)
    $badgeF = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Bossy R - ar - Grade 1", $badgeF, $starB, 540, 18)
}
