;(() => {
    function getSide(placement) {
        return placement.split('-')[0]
    }
    function getAlignment(placement) {
        return placement.split('-')[1]
    }
    function getMainAxisFromPlacement(placement) {
        return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y'
    }
    function getLengthFromAxis(axis) {
        return axis === 'y' ? 'height' : 'width'
    }
    function computeCoordsFromPlacement(_ref, placement, rtl) {
        let { reference, floating } = _ref,
            commonX = reference.x + reference.width / 2 - floating.width / 2,
            commonY = reference.y + reference.height / 2 - floating.height / 2,
            mainAxis = getMainAxisFromPlacement(placement),
            length = getLengthFromAxis(mainAxis),
            commonAlign = reference[length] / 2 - floating[length] / 2,
            side = getSide(placement),
            isVertical = mainAxis === 'x',
            coords
        switch (side) {
            case 'top':
                coords = { x: commonX, y: reference.y - floating.height }
                break
            case 'bottom':
                coords = { x: commonX, y: reference.y + reference.height }
                break
            case 'right':
                coords = { x: reference.x + reference.width, y: commonY }
                break
            case 'left':
                coords = { x: reference.x - floating.width, y: commonY }
                break
            default:
                coords = { x: reference.x, y: reference.y }
        }
        switch (getAlignment(placement)) {
            case 'start':
                coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1)
                break
            case 'end':
                coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1)
                break
        }
        return coords
    }
    var computePosition = async (reference, floating, config) => {
        let {
                placement = 'bottom',
                strategy = 'absolute',
                middleware = [],
                platform: platform2,
            } = config,
            rtl = await (platform2.isRTL == null
                ? void 0
                : platform2.isRTL(floating))
        if (
            (platform2 == null &&
                console.error(
                    [
                        'Floating UI: `platform` property was not passed to config. If you',
                        'want to use Floating UI on the web, install @floating-ui/dom',
                        'instead of the /core package. Otherwise, you can create your own',
                        '`platform`: https://floating-ui.com/docs/platform',
                    ].join(' '),
                ),
            middleware.filter((_ref) => {
                let { name } = _ref
                return name === 'autoPlacement' || name === 'flip'
            }).length > 1)
        )
            throw new Error(
                [
                    'Floating UI: duplicate `flip` and/or `autoPlacement`',
                    'middleware detected. This will lead to an infinite loop. Ensure only',
                    'one of either has been passed to the `middleware` array.',
                ].join(' '),
            )
        let rects = await platform2.getElementRects({
                reference,
                floating,
                strategy,
            }),
            { x, y } = computeCoordsFromPlacement(rects, placement, rtl),
            statefulPlacement = placement,
            middlewareData = {},
            _debug_loop_count_ = 0
        for (let i = 0; i < middleware.length; i++) {
            if ((_debug_loop_count_++, _debug_loop_count_ > 100))
                throw new Error(
                    [
                        'Floating UI: The middleware lifecycle appears to be',
                        'running in an infinite loop. This is usually caused by a `reset`',
                        'continually being returned without a break condition.',
                    ].join(' '),
                )
            let { name, fn } = middleware[i],
                {
                    x: nextX,
                    y: nextY,
                    data,
                    reset,
                } = await fn({
                    x,
                    y,
                    initialPlacement: placement,
                    placement: statefulPlacement,
                    strategy,
                    middlewareData,
                    rects,
                    platform: platform2,
                    elements: { reference, floating },
                })
            if (
                ((x = nextX ?? x),
                (y = nextY ?? y),
                (middlewareData = {
                    ...middlewareData,
                    [name]: { ...middlewareData[name], ...data },
                }),
                reset)
            ) {
                typeof reset == 'object' &&
                    (reset.placement && (statefulPlacement = reset.placement),
                    reset.rects &&
                        (rects =
                            reset.rects === !0
                                ? await platform2.getElementRects({
                                      reference,
                                      floating,
                                      strategy,
                                  })
                                : reset.rects),
                    ({ x, y } = computeCoordsFromPlacement(
                        rects,
                        statefulPlacement,
                        rtl,
                    ))),
                    (i = -1)
                continue
            }
        }
        return { x, y, placement: statefulPlacement, strategy, middlewareData }
    }
    function expandPaddingObject(padding) {
        return { top: 0, right: 0, bottom: 0, left: 0, ...padding }
    }
    function getSideObjectFromPadding(padding) {
        return typeof padding != 'number'
            ? expandPaddingObject(padding)
            : { top: padding, right: padding, bottom: padding, left: padding }
    }
    function rectToClientRect(rect) {
        return {
            ...rect,
            top: rect.y,
            left: rect.x,
            right: rect.x + rect.width,
            bottom: rect.y + rect.height,
        }
    }
    async function detectOverflow(middlewareArguments, options) {
        var _await$platform$isEle
        options === void 0 && (options = {})
        let {
                x,
                y,
                platform: platform2,
                rects,
                elements,
                strategy,
            } = middlewareArguments,
            {
                boundary = 'clippingAncestors',
                rootBoundary = 'viewport',
                elementContext = 'floating',
                altBoundary = !1,
                padding = 0,
            } = options,
            paddingObject = getSideObjectFromPadding(padding),
            element =
                elements[
                    altBoundary
                        ? elementContext === 'floating'
                            ? 'reference'
                            : 'floating'
                        : elementContext
                ],
            clippingClientRect = rectToClientRect(
                await platform2.getClippingRect({
                    element: (
                        (_await$platform$isEle = await (platform2.isElement ==
                        null
                            ? void 0
                            : platform2.isElement(element))) != null
                            ? _await$platform$isEle
                            : !0
                    )
                        ? element
                        : element.contextElement ||
                          (await (platform2.getDocumentElement == null
                              ? void 0
                              : platform2.getDocumentElement(
                                    elements.floating,
                                ))),
                    boundary,
                    rootBoundary,
                    strategy,
                }),
            ),
            elementClientRect = rectToClientRect(
                platform2.convertOffsetParentRelativeRectToViewportRelativeRect
                    ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect(
                          {
                              rect:
                                  elementContext === 'floating'
                                      ? { ...rects.floating, x, y }
                                      : rects.reference,
                              offsetParent: await (platform2.getOffsetParent ==
                              null
                                  ? void 0
                                  : platform2.getOffsetParent(
                                        elements.floating,
                                    )),
                              strategy,
                          },
                      )
                    : rects[elementContext],
            )
        return {
            top:
                clippingClientRect.top -
                elementClientRect.top +
                paddingObject.top,
            bottom:
                elementClientRect.bottom -
                clippingClientRect.bottom +
                paddingObject.bottom,
            left:
                clippingClientRect.left -
                elementClientRect.left +
                paddingObject.left,
            right:
                elementClientRect.right -
                clippingClientRect.right +
                paddingObject.right,
        }
    }
    var min = Math.min,
        max = Math.max
    function within(min$1, value, max$1) {
        return max(min$1, min(value, max$1))
    }
    var arrow = (options) => ({
            name: 'arrow',
            options,
            async fn(middlewareArguments) {
                let { element, padding = 0 } = options ?? {},
                    {
                        x,
                        y,
                        placement,
                        rects,
                        platform: platform2,
                    } = middlewareArguments
                if (element == null)
                    return (
                        console.warn(
                            'Floating UI: No `element` was passed to the `arrow` middleware.',
                        ),
                        {}
                    )
                let paddingObject = getSideObjectFromPadding(padding),
                    coords = { x, y },
                    axis = getMainAxisFromPlacement(placement),
                    length = getLengthFromAxis(axis),
                    arrowDimensions = await platform2.getDimensions(element),
                    minProp = axis === 'y' ? 'top' : 'left',
                    maxProp = axis === 'y' ? 'bottom' : 'right',
                    endDiff =
                        rects.reference[length] +
                        rects.reference[axis] -
                        coords[axis] -
                        rects.floating[length],
                    startDiff = coords[axis] - rects.reference[axis],
                    arrowOffsetParent = await (platform2.getOffsetParent == null
                        ? void 0
                        : platform2.getOffsetParent(element)),
                    clientSize = arrowOffsetParent
                        ? axis === 'y'
                            ? arrowOffsetParent.clientHeight || 0
                            : arrowOffsetParent.clientWidth || 0
                        : 0,
                    centerToReference = endDiff / 2 - startDiff / 2,
                    min3 = paddingObject[minProp],
                    max3 =
                        clientSize -
                        arrowDimensions[length] -
                        paddingObject[maxProp],
                    center =
                        clientSize / 2 -
                        arrowDimensions[length] / 2 +
                        centerToReference,
                    offset2 = within(min3, center, max3)
                return {
                    data: { [axis]: offset2, centerOffset: center - offset2 },
                }
            },
        }),
        hash$1 = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' }
    function getOppositePlacement(placement) {
        return placement.replace(
            /left|right|bottom|top/g,
            (matched) => hash$1[matched],
        )
    }
    function getAlignmentSides(placement, rects, rtl) {
        rtl === void 0 && (rtl = !1)
        let alignment = getAlignment(placement),
            mainAxis = getMainAxisFromPlacement(placement),
            length = getLengthFromAxis(mainAxis),
            mainAlignmentSide =
                mainAxis === 'x'
                    ? alignment === (rtl ? 'end' : 'start')
                        ? 'right'
                        : 'left'
                    : alignment === 'start'
                    ? 'bottom'
                    : 'top'
        return (
            rects.reference[length] > rects.floating[length] &&
                (mainAlignmentSide = getOppositePlacement(mainAlignmentSide)),
            {
                main: mainAlignmentSide,
                cross: getOppositePlacement(mainAlignmentSide),
            }
        )
    }
    var hash = { start: 'end', end: 'start' }
    function getOppositeAlignmentPlacement(placement) {
        return placement.replace(/start|end/g, (matched) => hash[matched])
    }
    var sides = ['top', 'right', 'bottom', 'left'],
        allPlacements = sides.reduce(
            (acc, side) => acc.concat(side, side + '-start', side + '-end'),
            [],
        )
    function getPlacementList(alignment, autoAlignment, allowedPlacements) {
        return (
            alignment
                ? [
                      ...allowedPlacements.filter(
                          (placement) => getAlignment(placement) === alignment,
                      ),
                      ...allowedPlacements.filter(
                          (placement) => getAlignment(placement) !== alignment,
                      ),
                  ]
                : allowedPlacements.filter(
                      (placement) => getSide(placement) === placement,
                  )
        ).filter((placement) =>
            alignment
                ? getAlignment(placement) === alignment ||
                  (autoAlignment
                      ? getOppositeAlignmentPlacement(placement) !== placement
                      : !1)
                : !0,
        )
    }
    var autoPlacement = function (options) {
        return (
            options === void 0 && (options = {}),
            {
                name: 'autoPlacement',
                options,
                async fn(middlewareArguments) {
                    var _middlewareData$autoP,
                        _middlewareData$autoP2,
                        _middlewareData$autoP3,
                        _middlewareData$autoP4,
                        _placementsSortedByLe
                    let {
                            x,
                            y,
                            rects,
                            middlewareData,
                            placement,
                            platform: platform2,
                            elements,
                        } = middlewareArguments,
                        {
                            alignment = null,
                            allowedPlacements = allPlacements,
                            autoAlignment = !0,
                            ...detectOverflowOptions
                        } = options,
                        placements = getPlacementList(
                            alignment,
                            autoAlignment,
                            allowedPlacements,
                        ),
                        overflow = await detectOverflow(
                            middlewareArguments,
                            detectOverflowOptions,
                        ),
                        currentIndex =
                            (_middlewareData$autoP =
                                (_middlewareData$autoP2 =
                                    middlewareData.autoPlacement) == null
                                    ? void 0
                                    : _middlewareData$autoP2.index) != null
                                ? _middlewareData$autoP
                                : 0,
                        currentPlacement = placements[currentIndex]
                    if (currentPlacement == null) return {}
                    let { main, cross } = getAlignmentSides(
                        currentPlacement,
                        rects,
                        await (platform2.isRTL == null
                            ? void 0
                            : platform2.isRTL(elements.floating)),
                    )
                    if (placement !== currentPlacement)
                        return { x, y, reset: { placement: placements[0] } }
                    let currentOverflows = [
                            overflow[getSide(currentPlacement)],
                            overflow[main],
                            overflow[cross],
                        ],
                        allOverflows = [
                            ...((_middlewareData$autoP3 =
                                (_middlewareData$autoP4 =
                                    middlewareData.autoPlacement) == null
                                    ? void 0
                                    : _middlewareData$autoP4.overflows) != null
                                ? _middlewareData$autoP3
                                : []),
                            {
                                placement: currentPlacement,
                                overflows: currentOverflows,
                            },
                        ],
                        nextPlacement = placements[currentIndex + 1]
                    if (nextPlacement)
                        return {
                            data: {
                                index: currentIndex + 1,
                                overflows: allOverflows,
                            },
                            reset: { placement: nextPlacement },
                        }
                    let placementsSortedByLeastOverflow = allOverflows
                            .slice()
                            .sort((a, b) => a.overflows[0] - b.overflows[0]),
                        placementThatFitsOnAllSides =
                            (_placementsSortedByLe =
                                placementsSortedByLeastOverflow.find((_ref) => {
                                    let { overflows } = _ref
                                    return overflows.every(
                                        (overflow2) => overflow2 <= 0,
                                    )
                                })) == null
                                ? void 0
                                : _placementsSortedByLe.placement,
                        resetPlacement =
                            placementThatFitsOnAllSides ??
                            placementsSortedByLeastOverflow[0].placement
                    return resetPlacement !== placement
                        ? {
                              data: {
                                  index: currentIndex + 1,
                                  overflows: allOverflows,
                              },
                              reset: { placement: resetPlacement },
                          }
                        : {}
                },
            }
        )
    }
    function getExpandedPlacements(placement) {
        let oppositePlacement = getOppositePlacement(placement)
        return [
            getOppositeAlignmentPlacement(placement),
            oppositePlacement,
            getOppositeAlignmentPlacement(oppositePlacement),
        ]
    }
    var flip = function (options) {
        return (
            options === void 0 && (options = {}),
            {
                name: 'flip',
                options,
                async fn(middlewareArguments) {
                    var _middlewareData$flip
                    let {
                            placement,
                            middlewareData,
                            rects,
                            initialPlacement,
                            platform: platform2,
                            elements,
                        } = middlewareArguments,
                        {
                            mainAxis: checkMainAxis = !0,
                            crossAxis: checkCrossAxis = !0,
                            fallbackPlacements: specifiedFallbackPlacements,
                            fallbackStrategy = 'bestFit',
                            flipAlignment = !0,
                            ...detectOverflowOptions
                        } = options,
                        side = getSide(placement),
                        fallbackPlacements =
                            specifiedFallbackPlacements ||
                            (side === initialPlacement || !flipAlignment
                                ? [getOppositePlacement(initialPlacement)]
                                : getExpandedPlacements(initialPlacement)),
                        placements = [initialPlacement, ...fallbackPlacements],
                        overflow = await detectOverflow(
                            middlewareArguments,
                            detectOverflowOptions,
                        ),
                        overflows = [],
                        overflowsData =
                            ((_middlewareData$flip = middlewareData.flip) ==
                            null
                                ? void 0
                                : _middlewareData$flip.overflows) || []
                    if (
                        (checkMainAxis && overflows.push(overflow[side]),
                        checkCrossAxis)
                    ) {
                        let { main, cross } = getAlignmentSides(
                            placement,
                            rects,
                            await (platform2.isRTL == null
                                ? void 0
                                : platform2.isRTL(elements.floating)),
                        )
                        overflows.push(overflow[main], overflow[cross])
                    }
                    if (
                        ((overflowsData = [
                            ...overflowsData,
                            { placement, overflows },
                        ]),
                        !overflows.every((side2) => side2 <= 0))
                    ) {
                        var _middlewareData$flip$, _middlewareData$flip2
                        let nextIndex =
                                ((_middlewareData$flip$ =
                                    (_middlewareData$flip2 =
                                        middlewareData.flip) == null
                                        ? void 0
                                        : _middlewareData$flip2.index) != null
                                    ? _middlewareData$flip$
                                    : 0) + 1,
                            nextPlacement = placements[nextIndex]
                        if (nextPlacement)
                            return {
                                data: {
                                    index: nextIndex,
                                    overflows: overflowsData,
                                },
                                reset: { placement: nextPlacement },
                            }
                        let resetPlacement = 'bottom'
                        switch (fallbackStrategy) {
                            case 'bestFit': {
                                var _overflowsData$map$so
                                let placement2 =
                                    (_overflowsData$map$so = overflowsData
                                        .map((d) => [
                                            d,
                                            d.overflows
                                                .filter(
                                                    (overflow2) =>
                                                        overflow2 > 0,
                                                )
                                                .reduce(
                                                    (acc, overflow2) =>
                                                        acc + overflow2,
                                                    0,
                                                ),
                                        ])
                                        .sort((a, b) => a[1] - b[1])[0]) == null
                                        ? void 0
                                        : _overflowsData$map$so[0].placement
                                placement2 && (resetPlacement = placement2)
                                break
                            }
                            case 'initialPlacement':
                                resetPlacement = initialPlacement
                                break
                        }
                        if (placement !== resetPlacement)
                            return { reset: { placement: resetPlacement } }
                    }
                    return {}
                },
            }
        )
    }
    function getSideOffsets(overflow, rect) {
        return {
            top: overflow.top - rect.height,
            right: overflow.right - rect.width,
            bottom: overflow.bottom - rect.height,
            left: overflow.left - rect.width,
        }
    }
    function isAnySideFullyClipped(overflow) {
        return sides.some((side) => overflow[side] >= 0)
    }
    var hide = function (_temp) {
        let { strategy = 'referenceHidden', ...detectOverflowOptions } =
            _temp === void 0 ? {} : _temp
        return {
            name: 'hide',
            async fn(middlewareArguments) {
                let { rects } = middlewareArguments
                switch (strategy) {
                    case 'referenceHidden': {
                        let overflow = await detectOverflow(
                                middlewareArguments,
                                {
                                    ...detectOverflowOptions,
                                    elementContext: 'reference',
                                },
                            ),
                            offsets = getSideOffsets(overflow, rects.reference)
                        return {
                            data: {
                                referenceHiddenOffsets: offsets,
                                referenceHidden: isAnySideFullyClipped(offsets),
                            },
                        }
                    }
                    case 'escaped': {
                        let overflow = await detectOverflow(
                                middlewareArguments,
                                { ...detectOverflowOptions, altBoundary: !0 },
                            ),
                            offsets = getSideOffsets(overflow, rects.floating)
                        return {
                            data: {
                                escapedOffsets: offsets,
                                escaped: isAnySideFullyClipped(offsets),
                            },
                        }
                    }
                    default:
                        return {}
                }
            },
        }
    }
    function convertValueToCoords(placement, rects, value, rtl) {
        rtl === void 0 && (rtl = !1)
        let side = getSide(placement),
            alignment = getAlignment(placement),
            isVertical = getMainAxisFromPlacement(placement) === 'x',
            mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1,
            crossAxisMulti = rtl && isVertical ? -1 : 1,
            rawValue =
                typeof value == 'function'
                    ? value({ ...rects, placement })
                    : value,
            { mainAxis, crossAxis, alignmentAxis } =
                typeof rawValue == 'number'
                    ? { mainAxis: rawValue, crossAxis: 0, alignmentAxis: null }
                    : {
                          mainAxis: 0,
                          crossAxis: 0,
                          alignmentAxis: null,
                          ...rawValue,
                      }
        return (
            alignment &&
                typeof alignmentAxis == 'number' &&
                (crossAxis =
                    alignment === 'end' ? alignmentAxis * -1 : alignmentAxis),
            isVertical
                ? { x: crossAxis * crossAxisMulti, y: mainAxis * mainAxisMulti }
                : { x: mainAxis * mainAxisMulti, y: crossAxis * crossAxisMulti }
        )
    }
    var offset = function (value) {
        return (
            value === void 0 && (value = 0),
            {
                name: 'offset',
                options: value,
                async fn(middlewareArguments) {
                    let {
                            x,
                            y,
                            placement,
                            rects,
                            platform: platform2,
                            elements,
                        } = middlewareArguments,
                        diffCoords = convertValueToCoords(
                            placement,
                            rects,
                            value,
                            await (platform2.isRTL == null
                                ? void 0
                                : platform2.isRTL(elements.floating)),
                        )
                    return {
                        x: x + diffCoords.x,
                        y: y + diffCoords.y,
                        data: diffCoords,
                    }
                },
            }
        )
    }
    function getCrossAxis(axis) {
        return axis === 'x' ? 'y' : 'x'
    }
    var shift = function (options) {
            return (
                options === void 0 && (options = {}),
                {
                    name: 'shift',
                    options,
                    async fn(middlewareArguments) {
                        let { x, y, placement } = middlewareArguments,
                            {
                                mainAxis: checkMainAxis = !0,
                                crossAxis: checkCrossAxis = !1,
                                limiter = {
                                    fn: (_ref) => {
                                        let { x: x2, y: y2 } = _ref
                                        return { x: x2, y: y2 }
                                    },
                                },
                                ...detectOverflowOptions
                            } = options,
                            coords = { x, y },
                            overflow = await detectOverflow(
                                middlewareArguments,
                                detectOverflowOptions,
                            ),
                            mainAxis = getMainAxisFromPlacement(
                                getSide(placement),
                            ),
                            crossAxis = getCrossAxis(mainAxis),
                            mainAxisCoord = coords[mainAxis],
                            crossAxisCoord = coords[crossAxis]
                        if (checkMainAxis) {
                            let minSide = mainAxis === 'y' ? 'top' : 'left',
                                maxSide = mainAxis === 'y' ? 'bottom' : 'right',
                                min3 = mainAxisCoord + overflow[minSide],
                                max3 = mainAxisCoord - overflow[maxSide]
                            mainAxisCoord = within(min3, mainAxisCoord, max3)
                        }
                        if (checkCrossAxis) {
                            let minSide = crossAxis === 'y' ? 'top' : 'left',
                                maxSide =
                                    crossAxis === 'y' ? 'bottom' : 'right',
                                min3 = crossAxisCoord + overflow[minSide],
                                max3 = crossAxisCoord - overflow[maxSide]
                            crossAxisCoord = within(min3, crossAxisCoord, max3)
                        }
                        let limitedCoords = limiter.fn({
                            ...middlewareArguments,
                            [mainAxis]: mainAxisCoord,
                            [crossAxis]: crossAxisCoord,
                        })
                        return {
                            ...limitedCoords,
                            data: {
                                x: limitedCoords.x - x,
                                y: limitedCoords.y - y,
                            },
                        }
                    },
                }
            )
        },
        size = function (options) {
            return (
                options === void 0 && (options = {}),
                {
                    name: 'size',
                    options,
                    async fn(middlewareArguments) {
                        let {
                                placement,
                                rects,
                                platform: platform2,
                                elements,
                            } = middlewareArguments,
                            { apply, ...detectOverflowOptions } = options,
                            overflow = await detectOverflow(
                                middlewareArguments,
                                detectOverflowOptions,
                            ),
                            side = getSide(placement),
                            alignment = getAlignment(placement),
                            heightSide,
                            widthSide
                        side === 'top' || side === 'bottom'
                            ? ((heightSide = side),
                              (widthSide =
                                  alignment ===
                                  ((await (platform2.isRTL == null
                                      ? void 0
                                      : platform2.isRTL(elements.floating)))
                                      ? 'start'
                                      : 'end')
                                      ? 'left'
                                      : 'right'))
                            : ((widthSide = side),
                              (heightSide =
                                  alignment === 'end' ? 'top' : 'bottom'))
                        let xMin = max(overflow.left, 0),
                            xMax = max(overflow.right, 0),
                            yMin = max(overflow.top, 0),
                            yMax = max(overflow.bottom, 0),
                            dimensions = {
                                height:
                                    rects.floating.height -
                                    (['left', 'right'].includes(placement)
                                        ? 2 *
                                          (yMin !== 0 || yMax !== 0
                                              ? yMin + yMax
                                              : max(
                                                    overflow.top,
                                                    overflow.bottom,
                                                ))
                                        : overflow[heightSide]),
                                width:
                                    rects.floating.width -
                                    (['top', 'bottom'].includes(placement)
                                        ? 2 *
                                          (xMin !== 0 || xMax !== 0
                                              ? xMin + xMax
                                              : max(
                                                    overflow.left,
                                                    overflow.right,
                                                ))
                                        : overflow[widthSide]),
                            },
                            prevDimensions = await platform2.getDimensions(
                                elements.floating,
                            )
                        apply == null || apply({ ...dimensions, ...rects })
                        let nextDimensions = await platform2.getDimensions(
                            elements.floating,
                        )
                        return prevDimensions.width !== nextDimensions.width ||
                            prevDimensions.height !== nextDimensions.height
                            ? { reset: { rects: !0 } }
                            : {}
                    },
                }
            )
        },
        inline = function (options) {
            return (
                options === void 0 && (options = {}),
                {
                    name: 'inline',
                    options,
                    async fn(middlewareArguments) {
                        var _await$platform$getCl
                        let {
                                placement,
                                elements,
                                rects,
                                platform: platform2,
                                strategy,
                            } = middlewareArguments,
                            { padding = 2, x, y } = options,
                            fallback = rectToClientRect(
                                platform2.convertOffsetParentRelativeRectToViewportRelativeRect
                                    ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect(
                                          {
                                              rect: rects.reference,
                                              offsetParent:
                                                  await (platform2.getOffsetParent ==
                                                  null
                                                      ? void 0
                                                      : platform2.getOffsetParent(
                                                            elements.floating,
                                                        )),
                                              strategy,
                                          },
                                      )
                                    : rects.reference,
                            ),
                            clientRects =
                                (_await$platform$getCl =
                                    await (platform2.getClientRects == null
                                        ? void 0
                                        : platform2.getClientRects(
                                              elements.reference,
                                          ))) != null
                                    ? _await$platform$getCl
                                    : [],
                            paddingObject = getSideObjectFromPadding(padding)
                        function getBoundingClientRect2() {
                            if (
                                clientRects.length === 2 &&
                                clientRects[0].left > clientRects[1].right &&
                                x != null &&
                                y != null
                            ) {
                                var _clientRects$find
                                return (_clientRects$find = clientRects.find(
                                    (rect) =>
                                        x > rect.left - paddingObject.left &&
                                        x < rect.right + paddingObject.right &&
                                        y > rect.top - paddingObject.top &&
                                        y < rect.bottom + paddingObject.bottom,
                                )) != null
                                    ? _clientRects$find
                                    : fallback
                            }
                            if (clientRects.length >= 2) {
                                if (
                                    getMainAxisFromPlacement(placement) === 'x'
                                ) {
                                    let firstRect = clientRects[0],
                                        lastRect =
                                            clientRects[clientRects.length - 1],
                                        isTop = getSide(placement) === 'top',
                                        top2 = firstRect.top,
                                        bottom2 = lastRect.bottom,
                                        left2 = isTop
                                            ? firstRect.left
                                            : lastRect.left,
                                        right2 = isTop
                                            ? firstRect.right
                                            : lastRect.right,
                                        width2 = right2 - left2,
                                        height2 = bottom2 - top2
                                    return {
                                        top: top2,
                                        bottom: bottom2,
                                        left: left2,
                                        right: right2,
                                        width: width2,
                                        height: height2,
                                        x: left2,
                                        y: top2,
                                    }
                                }
                                let isLeftSide = getSide(placement) === 'left',
                                    maxRight = max(
                                        ...clientRects.map(
                                            (rect) => rect.right,
                                        ),
                                    ),
                                    minLeft = min(
                                        ...clientRects.map((rect) => rect.left),
                                    ),
                                    measureRects = clientRects.filter((rect) =>
                                        isLeftSide
                                            ? rect.left === minLeft
                                            : rect.right === maxRight,
                                    ),
                                    top = measureRects[0].top,
                                    bottom =
                                        measureRects[measureRects.length - 1]
                                            .bottom,
                                    left = minLeft,
                                    right = maxRight,
                                    width = right - left,
                                    height = bottom - top
                                return {
                                    top,
                                    bottom,
                                    left,
                                    right,
                                    width,
                                    height,
                                    x: left,
                                    y: top,
                                }
                            }
                            return fallback
                        }
                        let resetRects = await platform2.getElementRects({
                            reference: {
                                getBoundingClientRect: getBoundingClientRect2,
                            },
                            floating: elements.floating,
                            strategy,
                        })
                        return rects.reference.x !== resetRects.reference.x ||
                            rects.reference.y !== resetRects.reference.y ||
                            rects.reference.width !==
                                resetRects.reference.width ||
                            rects.reference.height !==
                                resetRects.reference.height
                            ? { reset: { rects: resetRects } }
                            : {}
                    },
                }
            )
        }
    function isWindow(value) {
        return (
            value &&
            value.document &&
            value.location &&
            value.alert &&
            value.setInterval
        )
    }
    function getWindow(node) {
        if (node == null) return window
        if (!isWindow(node)) {
            let ownerDocument = node.ownerDocument
            return (ownerDocument && ownerDocument.defaultView) || window
        }
        return node
    }
    function getComputedStyle$1(element) {
        return getWindow(element).getComputedStyle(element)
    }
    function getNodeName(node) {
        return isWindow(node)
            ? ''
            : node
            ? (node.nodeName || '').toLowerCase()
            : ''
    }
    function isHTMLElement(value) {
        return value instanceof getWindow(value).HTMLElement
    }
    function isElement(value) {
        return value instanceof getWindow(value).Element
    }
    function isNode(value) {
        return value instanceof getWindow(value).Node
    }
    function isShadowRoot(node) {
        if (typeof ShadowRoot == 'undefined') return !1
        let OwnElement = getWindow(node).ShadowRoot
        return node instanceof OwnElement || node instanceof ShadowRoot
    }
    function isOverflowElement(element) {
        let { overflow, overflowX, overflowY } = getComputedStyle$1(element)
        return /auto|scroll|overlay|hidden/.test(
            overflow + overflowY + overflowX,
        )
    }
    function isTableElement(element) {
        return ['table', 'td', 'th'].includes(getNodeName(element))
    }
    function isContainingBlock(element) {
        let isFirefox = navigator.userAgent.toLowerCase().includes('firefox'),
            css2 = getComputedStyle$1(element)
        return (
            css2.transform !== 'none' ||
            css2.perspective !== 'none' ||
            css2.contain === 'paint' ||
            ['transform', 'perspective'].includes(css2.willChange) ||
            (isFirefox && css2.willChange === 'filter') ||
            (isFirefox && (css2.filter ? css2.filter !== 'none' : !1))
        )
    }
    function isLayoutViewport() {
        return !/^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    }
    var min2 = Math.min,
        max2 = Math.max,
        round = Math.round
    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
        var _win$visualViewport$o,
            _win$visualViewport,
            _win$visualViewport$o2,
            _win$visualViewport2
        includeScale === void 0 && (includeScale = !1),
            isFixedStrategy === void 0 && (isFixedStrategy = !1)
        let clientRect = element.getBoundingClientRect(),
            scaleX = 1,
            scaleY = 1
        includeScale &&
            isHTMLElement(element) &&
            ((scaleX =
                (element.offsetWidth > 0 &&
                    round(clientRect.width) / element.offsetWidth) ||
                1),
            (scaleY =
                (element.offsetHeight > 0 &&
                    round(clientRect.height) / element.offsetHeight) ||
                1))
        let win = isElement(element) ? getWindow(element) : window,
            addVisualOffsets = !isLayoutViewport() && isFixedStrategy,
            x =
                (clientRect.left +
                    (addVisualOffsets &&
                    (_win$visualViewport$o =
                        (_win$visualViewport = win.visualViewport) == null
                            ? void 0
                            : _win$visualViewport.offsetLeft) != null
                        ? _win$visualViewport$o
                        : 0)) /
                scaleX,
            y =
                (clientRect.top +
                    (addVisualOffsets &&
                    (_win$visualViewport$o2 =
                        (_win$visualViewport2 = win.visualViewport) == null
                            ? void 0
                            : _win$visualViewport2.offsetTop) != null
                        ? _win$visualViewport$o2
                        : 0)) /
                scaleY,
            width = clientRect.width / scaleX,
            height = clientRect.height / scaleY
        return {
            width,
            height,
            top: y,
            right: x + width,
            bottom: y + height,
            left: x,
            x,
            y,
        }
    }
    function getDocumentElement(node) {
        return (
            (isNode(node) ? node.ownerDocument : node.document) ||
            window.document
        ).documentElement
    }
    function getNodeScroll(element) {
        return isElement(element)
            ? { scrollLeft: element.scrollLeft, scrollTop: element.scrollTop }
            : {
                  scrollLeft: element.pageXOffset,
                  scrollTop: element.pageYOffset,
              }
    }
    function getWindowScrollBarX(element) {
        return (
            getBoundingClientRect(getDocumentElement(element)).left +
            getNodeScroll(element).scrollLeft
        )
    }
    function isScaled(element) {
        let rect = getBoundingClientRect(element)
        return (
            round(rect.width) !== element.offsetWidth ||
            round(rect.height) !== element.offsetHeight
        )
    }
    function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
        let isOffsetParentAnElement = isHTMLElement(offsetParent),
            documentElement = getDocumentElement(offsetParent),
            rect = getBoundingClientRect(
                element,
                isOffsetParentAnElement && isScaled(offsetParent),
                strategy === 'fixed',
            ),
            scroll = { scrollLeft: 0, scrollTop: 0 },
            offsets = { x: 0, y: 0 }
        if (
            isOffsetParentAnElement ||
            (!isOffsetParentAnElement && strategy !== 'fixed')
        )
            if (
                ((getNodeName(offsetParent) !== 'body' ||
                    isOverflowElement(documentElement)) &&
                    (scroll = getNodeScroll(offsetParent)),
                isHTMLElement(offsetParent))
            ) {
                let offsetRect = getBoundingClientRect(offsetParent, !0)
                ;(offsets.x = offsetRect.x + offsetParent.clientLeft),
                    (offsets.y = offsetRect.y + offsetParent.clientTop)
            } else
                documentElement &&
                    (offsets.x = getWindowScrollBarX(documentElement))
        return {
            x: rect.left + scroll.scrollLeft - offsets.x,
            y: rect.top + scroll.scrollTop - offsets.y,
            width: rect.width,
            height: rect.height,
        }
    }
    function getParentNode(node) {
        return getNodeName(node) === 'html'
            ? node
            : node.assignedSlot ||
                  node.parentNode ||
                  (isShadowRoot(node) ? node.host : null) ||
                  getDocumentElement(node)
    }
    function getTrueOffsetParent(element) {
        return !isHTMLElement(element) ||
            getComputedStyle(element).position === 'fixed'
            ? null
            : element.offsetParent
    }
    function getContainingBlock(element) {
        let currentNode = getParentNode(element)
        for (
            isShadowRoot(currentNode) && (currentNode = currentNode.host);
            isHTMLElement(currentNode) &&
            !['html', 'body'].includes(getNodeName(currentNode));

        ) {
            if (isContainingBlock(currentNode)) return currentNode
            currentNode = currentNode.parentNode
        }
        return null
    }
    function getOffsetParent(element) {
        let window2 = getWindow(element),
            offsetParent = getTrueOffsetParent(element)
        for (
            ;
            offsetParent &&
            isTableElement(offsetParent) &&
            getComputedStyle(offsetParent).position === 'static';

        )
            offsetParent = getTrueOffsetParent(offsetParent)
        return offsetParent &&
            (getNodeName(offsetParent) === 'html' ||
                (getNodeName(offsetParent) === 'body' &&
                    getComputedStyle(offsetParent).position === 'static' &&
                    !isContainingBlock(offsetParent)))
            ? window2
            : offsetParent || getContainingBlock(element) || window2
    }
    function getDimensions(element) {
        if (isHTMLElement(element))
            return { width: element.offsetWidth, height: element.offsetHeight }
        let rect = getBoundingClientRect(element)
        return { width: rect.width, height: rect.height }
    }
    function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
        let { rect, offsetParent, strategy } = _ref,
            isOffsetParentAnElement = isHTMLElement(offsetParent),
            documentElement = getDocumentElement(offsetParent)
        if (offsetParent === documentElement) return rect
        let scroll = { scrollLeft: 0, scrollTop: 0 },
            offsets = { x: 0, y: 0 }
        if (
            (isOffsetParentAnElement ||
                (!isOffsetParentAnElement && strategy !== 'fixed')) &&
            ((getNodeName(offsetParent) !== 'body' ||
                isOverflowElement(documentElement)) &&
                (scroll = getNodeScroll(offsetParent)),
            isHTMLElement(offsetParent))
        ) {
            let offsetRect = getBoundingClientRect(offsetParent, !0)
            ;(offsets.x = offsetRect.x + offsetParent.clientLeft),
                (offsets.y = offsetRect.y + offsetParent.clientTop)
        }
        return {
            ...rect,
            x: rect.x - scroll.scrollLeft + offsets.x,
            y: rect.y - scroll.scrollTop + offsets.y,
        }
    }
    function getViewportRect(element, strategy) {
        let win = getWindow(element),
            html = getDocumentElement(element),
            visualViewport = win.visualViewport,
            width = html.clientWidth,
            height = html.clientHeight,
            x = 0,
            y = 0
        if (visualViewport) {
            ;(width = visualViewport.width), (height = visualViewport.height)
            let layoutViewport = isLayoutViewport()
            ;(layoutViewport || (!layoutViewport && strategy === 'fixed')) &&
                ((x = visualViewport.offsetLeft),
                (y = visualViewport.offsetTop))
        }
        return { width, height, x, y }
    }
    function getDocumentRect(element) {
        var _element$ownerDocumen
        let html = getDocumentElement(element),
            scroll = getNodeScroll(element),
            body =
                (_element$ownerDocumen = element.ownerDocument) == null
                    ? void 0
                    : _element$ownerDocumen.body,
            width = max2(
                html.scrollWidth,
                html.clientWidth,
                body ? body.scrollWidth : 0,
                body ? body.clientWidth : 0,
            ),
            height = max2(
                html.scrollHeight,
                html.clientHeight,
                body ? body.scrollHeight : 0,
                body ? body.clientHeight : 0,
            ),
            x = -scroll.scrollLeft + getWindowScrollBarX(element),
            y = -scroll.scrollTop
        return (
            getComputedStyle$1(body || html).direction === 'rtl' &&
                (x +=
                    max2(html.clientWidth, body ? body.clientWidth : 0) -
                    width),
            { width, height, x, y }
        )
    }
    function getNearestOverflowAncestor(node) {
        let parentNode = getParentNode(node)
        return ['html', 'body', '#document'].includes(getNodeName(parentNode))
            ? node.ownerDocument.body
            : isHTMLElement(parentNode) && isOverflowElement(parentNode)
            ? parentNode
            : getNearestOverflowAncestor(parentNode)
    }
    function getOverflowAncestors(node, list) {
        var _node$ownerDocument
        list === void 0 && (list = [])
        let scrollableAncestor = getNearestOverflowAncestor(node),
            isBody =
                scrollableAncestor ===
                ((_node$ownerDocument = node.ownerDocument) == null
                    ? void 0
                    : _node$ownerDocument.body),
            win = getWindow(scrollableAncestor),
            target = isBody
                ? [win].concat(
                      win.visualViewport || [],
                      isOverflowElement(scrollableAncestor)
                          ? scrollableAncestor
                          : [],
                  )
                : scrollableAncestor,
            updatedList = list.concat(target)
        return isBody
            ? updatedList
            : updatedList.concat(getOverflowAncestors(target))
    }
    function contains(parent, child) {
        let rootNode =
            child == null || child.getRootNode == null
                ? void 0
                : child.getRootNode()
        if (parent != null && parent.contains(child)) return !0
        if (rootNode && isShadowRoot(rootNode)) {
            let next = child
            do {
                if (next && parent === next) return !0
                next = next.parentNode || next.host
            } while (next)
        }
        return !1
    }
    function getInnerBoundingClientRect(element, strategy) {
        let clientRect = getBoundingClientRect(
                element,
                !1,
                strategy === 'fixed',
            ),
            top = clientRect.top + element.clientTop,
            left = clientRect.left + element.clientLeft
        return {
            top,
            left,
            x: left,
            y: top,
            right: left + element.clientWidth,
            bottom: top + element.clientHeight,
            width: element.clientWidth,
            height: element.clientHeight,
        }
    }
    function getClientRectFromClippingAncestor(
        element,
        clippingParent,
        strategy,
    ) {
        return clippingParent === 'viewport'
            ? rectToClientRect(getViewportRect(element, strategy))
            : isElement(clippingParent)
            ? getInnerBoundingClientRect(clippingParent, strategy)
            : rectToClientRect(getDocumentRect(getDocumentElement(element)))
    }
    function getClippingAncestors(element) {
        let clippingAncestors = getOverflowAncestors(element),
            clipperElement =
                ['absolute', 'fixed'].includes(
                    getComputedStyle$1(element).position,
                ) && isHTMLElement(element)
                    ? getOffsetParent(element)
                    : element
        return isElement(clipperElement)
            ? clippingAncestors.filter(
                  (clippingAncestors2) =>
                      isElement(clippingAncestors2) &&
                      contains(clippingAncestors2, clipperElement) &&
                      getNodeName(clippingAncestors2) !== 'body',
              )
            : []
    }
    function getClippingRect(_ref) {
        let { element, boundary, rootBoundary, strategy } = _ref,
            clippingAncestors = [
                ...(boundary === 'clippingAncestors'
                    ? getClippingAncestors(element)
                    : [].concat(boundary)),
                rootBoundary,
            ],
            firstClippingAncestor = clippingAncestors[0],
            clippingRect = clippingAncestors.reduce(
                (accRect, clippingAncestor) => {
                    let rect = getClientRectFromClippingAncestor(
                        element,
                        clippingAncestor,
                        strategy,
                    )
                    return (
                        (accRect.top = max2(rect.top, accRect.top)),
                        (accRect.right = min2(rect.right, accRect.right)),
                        (accRect.bottom = min2(rect.bottom, accRect.bottom)),
                        (accRect.left = max2(rect.left, accRect.left)),
                        accRect
                    )
                },
                getClientRectFromClippingAncestor(
                    element,
                    firstClippingAncestor,
                    strategy,
                ),
            )
        return {
            width: clippingRect.right - clippingRect.left,
            height: clippingRect.bottom - clippingRect.top,
            x: clippingRect.left,
            y: clippingRect.top,
        }
    }
    var platform = {
        getClippingRect,
        convertOffsetParentRelativeRectToViewportRelativeRect,
        isElement,
        getDimensions,
        getOffsetParent,
        getDocumentElement,
        getElementRects: (_ref) => {
            let { reference, floating, strategy } = _ref
            return {
                reference: getRectRelativeToOffsetParent(
                    reference,
                    getOffsetParent(floating),
                    strategy,
                ),
                floating: { ...getDimensions(floating), x: 0, y: 0 },
            }
        },
        getClientRects: (element) => Array.from(element.getClientRects()),
        isRTL: (element) => getComputedStyle$1(element).direction === 'rtl',
    }
    function autoUpdate(reference, floating, update, options) {
        options === void 0 && (options = {})
        let {
                ancestorScroll: _ancestorScroll = !0,
                ancestorResize: _ancestorResize = !0,
                elementResize: _elementResize = !0,
                animationFrame = !1,
            } = options,
            cleanedUp = !1,
            ancestorScroll = _ancestorScroll && !animationFrame,
            ancestorResize = _ancestorResize && !animationFrame,
            elementResize = _elementResize && !animationFrame,
            ancestors =
                ancestorScroll || ancestorResize
                    ? [
                          ...(isElement(reference)
                              ? getOverflowAncestors(reference)
                              : []),
                          ...getOverflowAncestors(floating),
                      ]
                    : []
        ancestors.forEach((ancestor) => {
            ancestorScroll &&
                ancestor.addEventListener('scroll', update, { passive: !0 }),
                ancestorResize && ancestor.addEventListener('resize', update)
        })
        let observer2 = null
        elementResize &&
            ((observer2 = new ResizeObserver(update)),
            isElement(reference) && observer2.observe(reference),
            observer2.observe(floating))
        let frameId,
            prevRefRect = animationFrame
                ? getBoundingClientRect(reference)
                : null
        animationFrame && frameLoop()
        function frameLoop() {
            if (cleanedUp) return
            let nextRefRect = getBoundingClientRect(reference)
            prevRefRect &&
                (nextRefRect.x !== prevRefRect.x ||
                    nextRefRect.y !== prevRefRect.y ||
                    nextRefRect.width !== prevRefRect.width ||
                    nextRefRect.height !== prevRefRect.height) &&
                update(),
                (prevRefRect = nextRefRect),
                (frameId = requestAnimationFrame(frameLoop))
        }
        return () => {
            var _observer
            ;(cleanedUp = !0),
                ancestors.forEach((ancestor) => {
                    ancestorScroll &&
                        ancestor.removeEventListener('scroll', update),
                        ancestorResize &&
                            ancestor.removeEventListener('resize', update)
                }),
                (_observer = observer2) == null || _observer.disconnect(),
                (observer2 = null),
                animationFrame && cancelAnimationFrame(frameId)
        }
    }
    var computePosition2 = (reference, floating, options) =>
            computePosition(reference, floating, { platform, ...options }),
        buildConfigFromModifiers = (modifiers) => {
            let config = { placement: 'bottom', middleware: [] },
                keys = Object.keys(modifiers),
                getModifierArgument = (modifier) => modifiers[modifier]
            return (
                keys.includes('offset') &&
                    config.middleware.push(
                        offset(getModifierArgument('offset')),
                    ),
                keys.includes('placement') &&
                    (config.placement = getModifierArgument('placement')),
                keys.includes('autoPlacement') &&
                    !keys.includes('flip') &&
                    config.middleware.push(
                        autoPlacement(getModifierArgument('autoPlacement')),
                    ),
                keys.includes('flip') &&
                    config.middleware.push(flip(getModifierArgument('flip'))),
                keys.includes('shift') &&
                    config.middleware.push(shift(getModifierArgument('shift'))),
                keys.includes('inline') &&
                    config.middleware.push(
                        inline(getModifierArgument('inline')),
                    ),
                keys.includes('arrow') &&
                    config.middleware.push(arrow(getModifierArgument('arrow'))),
                keys.includes('hide') &&
                    config.middleware.push(hide(getModifierArgument('hide'))),
                keys.includes('size') &&
                    config.middleware.push(size(getModifierArgument('size'))),
                config
            )
        },
        buildDirectiveConfigFromModifiers = (modifiers, settings) => {
            let config = {
                    component: { trap: !1 },
                    float: {
                        placement: 'bottom',
                        strategy: 'absolute',
                        middleware: [],
                    },
                },
                getModifierArgument = (modifier) =>
                    modifiers[modifiers.indexOf(modifier) + 1]
            return (
                modifiers.includes('trap') && (config.component.trap = !0),
                modifiers.includes('teleport') &&
                    (config.float.strategy = 'fixed'),
                modifiers.includes('offset') &&
                    config.float.middleware.push(offset(settings.offset || 10)),
                modifiers.includes('placement') &&
                    (config.float.placement = getModifierArgument('placement')),
                modifiers.includes('autoPlacement') &&
                    !modifiers.includes('flip') &&
                    config.float.middleware.push(
                        autoPlacement(settings.autoPlacement),
                    ),
                modifiers.includes('flip') &&
                    config.float.middleware.push(flip(settings.flip)),
                modifiers.includes('shift') &&
                    config.float.middleware.push(shift(settings.shift)),
                modifiers.includes('inline') &&
                    config.float.middleware.push(inline(settings.inline)),
                modifiers.includes('arrow') &&
                    config.float.middleware.push(arrow(settings.arrow)),
                modifiers.includes('hide') &&
                    config.float.middleware.push(hide(settings.hide)),
                modifiers.includes('size') &&
                    config.float.middleware.push(size(settings.size)),
                config
            )
        },
        randomString = (length) => {
            var chars =
                    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(
                        '',
                    ),
                str = ''
            length || (length = Math.floor(Math.random() * chars.length))
            for (var i = 0; i < length; i++)
                str += chars[Math.floor(Math.random() * chars.length)]
            return str
        },
        onAttributeAddeds = [],
        onElRemoveds = [],
        onElAddeds = []
    function cleanupAttributes(el, names) {
        !el._x_attributeCleanups ||
            Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
                ;(names === void 0 || names.includes(name)) &&
                    (value.forEach((i) => i()),
                    delete el._x_attributeCleanups[name])
            })
    }
    var observer = new MutationObserver(onMutate),
        currentlyObserving = !1
    function startObservingMutations() {
        observer.observe(document, {
            subtree: !0,
            childList: !0,
            attributes: !0,
            attributeOldValue: !0,
        }),
            (currentlyObserving = !0)
    }
    function stopObservingMutations() {
        flushObserver(), observer.disconnect(), (currentlyObserving = !1)
    }
    var recordQueue = [],
        willProcessRecordQueue = !1
    function flushObserver() {
        ;(recordQueue = recordQueue.concat(observer.takeRecords())),
            recordQueue.length &&
                !willProcessRecordQueue &&
                ((willProcessRecordQueue = !0),
                queueMicrotask(() => {
                    processRecordQueue(), (willProcessRecordQueue = !1)
                }))
    }
    function processRecordQueue() {
        onMutate(recordQueue), (recordQueue.length = 0)
    }
    function mutateDom(callback) {
        if (!currentlyObserving) return callback()
        stopObservingMutations()
        let result = callback()
        return startObservingMutations(), result
    }
    var isCollecting = !1,
        deferredMutations = []
    function onMutate(mutations) {
        if (isCollecting) {
            deferredMutations = deferredMutations.concat(mutations)
            return
        }
        let addedNodes = [],
            removedNodes = [],
            addedAttributes = new Map(),
            removedAttributes = new Map()
        for (let i = 0; i < mutations.length; i++)
            if (
                !mutations[i].target._x_ignoreMutationObserver &&
                (mutations[i].type === 'childList' &&
                    (mutations[i].addedNodes.forEach(
                        (node) => node.nodeType === 1 && addedNodes.push(node),
                    ),
                    mutations[i].removedNodes.forEach(
                        (node) =>
                            node.nodeType === 1 && removedNodes.push(node),
                    )),
                mutations[i].type === 'attributes')
            ) {
                let el = mutations[i].target,
                    name = mutations[i].attributeName,
                    oldValue = mutations[i].oldValue,
                    add = () => {
                        addedAttributes.has(el) || addedAttributes.set(el, []),
                            addedAttributes
                                .get(el)
                                .push({ name, value: el.getAttribute(name) })
                    },
                    remove = () => {
                        removedAttributes.has(el) ||
                            removedAttributes.set(el, []),
                            removedAttributes.get(el).push(name)
                    }
                el.hasAttribute(name) && oldValue === null
                    ? add()
                    : el.hasAttribute(name)
                    ? (remove(), add())
                    : remove()
            }
        removedAttributes.forEach((attrs, el) => {
            cleanupAttributes(el, attrs)
        }),
            addedAttributes.forEach((attrs, el) => {
                onAttributeAddeds.forEach((i) => i(el, attrs))
            })
        for (let node of removedNodes)
            if (
                !addedNodes.includes(node) &&
                (onElRemoveds.forEach((i) => i(node)), node._x_cleanups)
            )
                for (; node._x_cleanups.length; ) node._x_cleanups.pop()()
        addedNodes.forEach((node) => {
            ;(node._x_ignoreSelf = !0), (node._x_ignore = !0)
        })
        for (let node of addedNodes)
            removedNodes.includes(node) ||
                !node.isConnected ||
                (delete node._x_ignoreSelf,
                delete node._x_ignore,
                onElAddeds.forEach((i) => i(node)),
                (node._x_ignore = !0),
                (node._x_ignoreSelf = !0))
        addedNodes.forEach((node) => {
            delete node._x_ignoreSelf, delete node._x_ignore
        }),
            (addedNodes = null),
            (removedNodes = null),
            (addedAttributes = null),
            (removedAttributes = null)
    }
    function once(callback, fallback = () => {}) {
        let called = !1
        return function () {
            called
                ? fallback.apply(this, arguments)
                : ((called = !0), callback.apply(this, arguments))
        }
    }
    function src_default(Alpine) {
        let defaultOptions = { dismissable: !0, trap: !1 }
        function setupA11y(component, trigger, panel = null) {
            if (!!trigger) {
                if (
                    (trigger.hasAttribute('aria-expanded') ||
                        trigger.setAttribute('aria-expanded', !1),
                    panel.hasAttribute('id'))
                )
                    trigger.setAttribute(
                        'aria-controls',
                        panel.getAttribute('id'),
                    )
                else {
                    let panelId = `panel-${randomString(8)}`
                    trigger.setAttribute('aria-controls', panelId),
                        panel.setAttribute('id', panelId)
                }
                panel.setAttribute('aria-modal', !0),
                    panel.setAttribute('role', 'dialog')
            }
        }
        let atMagicTrigger = document.querySelectorAll('[\\@click^="$float"]'),
            xMagicTrigger = document.querySelectorAll(
                '[x-on\\:click^="$float"]',
            )
        ;[...atMagicTrigger, ...xMagicTrigger].forEach((trigger) => {
            let component = trigger.parentElement.closest('[x-data]'),
                panel = component.querySelector('[x-ref="panel"]')
            setupA11y(component, trigger, panel)
        }),
            Alpine.magic('float', (el) => (modifiers = {}, settings = {}) => {
                let options = { ...defaultOptions, ...settings },
                    config =
                        Object.keys(modifiers).length > 0
                            ? buildConfigFromModifiers(modifiers)
                            : { middleware: [autoPlacement()] },
                    trigger = el,
                    component = el.parentElement.closest('[x-data]'),
                    panel = component.querySelector('[x-ref="panel"]')
                function isFloating() {
                    return panel.style.display == 'block'
                }
                function closePanel() {
                    ;(panel.style.display = ''),
                        trigger.setAttribute('aria-expanded', !1),
                        options.trap && panel.setAttribute('x-trap', !1),
                        autoUpdate(el, panel, update)
                }
                function openPanel() {
                    ;(panel.style.display = 'block'),
                        trigger.setAttribute('aria-expanded', !0),
                        options.trap && panel.setAttribute('x-trap', !0),
                        update()
                }
                function togglePanel() {
                    isFloating() ? closePanel() : openPanel()
                }
                async function update() {
                    return await computePosition2(el, panel, config).then(
                        ({ middlewareData, placement, x, y }) => {
                            if (middlewareData.arrow) {
                                let ax = middlewareData.arrow?.x,
                                    ay = middlewareData.arrow?.y,
                                    aEl = config.middleware.filter(
                                        (middleware) =>
                                            middleware.name == 'arrow',
                                    )[0].options.element,
                                    staticSide = {
                                        top: 'bottom',
                                        right: 'left',
                                        bottom: 'top',
                                        left: 'right',
                                    }[placement.split('-')[0]]
                                Object.assign(aEl.style, {
                                    left: ax != null ? `${ax}px` : '',
                                    top: ay != null ? `${ay}px` : '',
                                    right: '',
                                    bottom: '',
                                    [staticSide]: '-4px',
                                })
                            }
                            if (middlewareData.hide) {
                                let { referenceHidden } = middlewareData.hide
                                Object.assign(panel.style, {
                                    visibility: referenceHidden
                                        ? 'hidden'
                                        : 'visible',
                                })
                            }
                            Object.assign(panel.style, {
                                left: `${x}px`,
                                top: `${y}px`,
                            })
                        },
                    )
                }
                options.dismissable &&
                    (window.addEventListener('click', (event) => {
                        !component.contains(event.target) &&
                            isFloating() &&
                            togglePanel()
                    }),
                    window.addEventListener(
                        'keydown',
                        (event) => {
                            event.key === 'Escape' &&
                                isFloating() &&
                                togglePanel()
                        },
                        !0,
                    )),
                    togglePanel()
            }),
            Alpine.directive(
                'float',
                (panel, { modifiers, expression }, { evaluate, effect }) => {
                    let settings = expression ? evaluate(expression) : {},
                        config =
                            modifiers.length > 0
                                ? buildDirectiveConfigFromModifiers(
                                      modifiers,
                                      settings,
                                  )
                                : {},
                        cleanup = null
                    config.float.strategy == 'fixed' &&
                        (panel.style.position = 'fixed')
                    let clickAway = (event) =>
                            panel.parentElement &&
                            !panel.parentElement
                                .closest('[x-data]')
                                .contains(event.target)
                                ? panel.close()
                                : null,
                        keyEscape = (event) =>
                            event.key === 'Escape' ? panel.close() : null,
                        refName = panel.getAttribute('x-ref'),
                        component = panel.parentElement.closest('[x-data]'),
                        atTrigger = component.querySelectorAll(
                            `[\\@click^="$refs.${refName}"]`,
                        ),
                        xTrigger = component.querySelectorAll(
                            `[x-on\\:click^="$refs.${refName}"]`,
                        )
                    panel.style.setProperty('display', 'none'),
                        setupA11y(
                            component,
                            [...atTrigger, ...xTrigger][0],
                            panel,
                        ),
                        (panel._x_isShown = !1),
                        (panel.trigger = null),
                        panel._x_doHide ||
                            (panel._x_doHide = () => {
                                mutateDom(() => {
                                    panel.style.setProperty(
                                        'display',
                                        'none',
                                        modifiers.includes('important')
                                            ? 'important'
                                            : void 0,
                                    )
                                })
                            }),
                        panel._x_doShow ||
                            (panel._x_doShow = () => {
                                mutateDom(() => {
                                    panel.style.setProperty(
                                        'display',
                                        'block',
                                        modifiers.includes('important')
                                            ? 'important'
                                            : void 0,
                                    )
                                })
                            })
                    let hide2 = () => {
                            panel._x_doHide(), (panel._x_isShown = !1)
                        },
                        show = () => {
                            panel._x_doShow(), (panel._x_isShown = !0)
                        },
                        clickAwayCompatibleShow = () => setTimeout(show),
                        toggle = once(
                            (value) => (value ? show() : hide2()),
                            (value) => {
                                typeof panel._x_toggleAndCascadeWithTransitions ==
                                'function'
                                    ? panel._x_toggleAndCascadeWithTransitions(
                                          panel,
                                          value,
                                          show,
                                          hide2,
                                      )
                                    : value
                                    ? clickAwayCompatibleShow()
                                    : hide2()
                            },
                        ),
                        oldValue,
                        firstTime = !0
                    effect(() =>
                        evaluate((value) => {
                            ;(!firstTime && value === oldValue) ||
                                (modifiers.includes('immediate') &&
                                    (value
                                        ? clickAwayCompatibleShow()
                                        : hide2()),
                                toggle(value),
                                (oldValue = value),
                                (firstTime = !1))
                        }),
                    ),
                        (panel.open = async function (event) {
                            ;(panel.trigger = event.currentTarget
                                ? event.currentTarget
                                : event),
                                toggle(!0),
                                panel.trigger.setAttribute('aria-expanded', !0),
                                config.component.trap &&
                                    panel.setAttribute('x-trap', !0),
                                (cleanup = autoUpdate(
                                    panel.trigger,
                                    panel,
                                    () => {
                                        computePosition2(
                                            panel.trigger,
                                            panel,
                                            config.float,
                                        ).then(
                                            ({
                                                middlewareData,
                                                placement,
                                                x,
                                                y,
                                            }) => {
                                                if (middlewareData.arrow) {
                                                    let ax =
                                                            middlewareData.arrow
                                                                ?.x,
                                                        ay =
                                                            middlewareData.arrow
                                                                ?.y,
                                                        aEl =
                                                            config.float.middleware.filter(
                                                                (middleware) =>
                                                                    middleware.name ==
                                                                    'arrow',
                                                            )[0].options
                                                                .element,
                                                        staticSide = {
                                                            top: 'bottom',
                                                            right: 'left',
                                                            bottom: 'top',
                                                            left: 'right',
                                                        }[
                                                            placement.split(
                                                                '-',
                                                            )[0]
                                                        ]
                                                    Object.assign(aEl.style, {
                                                        left:
                                                            ax != null
                                                                ? `${ax}px`
                                                                : '',
                                                        top:
                                                            ay != null
                                                                ? `${ay}px`
                                                                : '',
                                                        right: '',
                                                        bottom: '',
                                                        [staticSide]: '-4px',
                                                    })
                                                }
                                                if (middlewareData.hide) {
                                                    let { referenceHidden } =
                                                        middlewareData.hide
                                                    Object.assign(panel.style, {
                                                        visibility:
                                                            referenceHidden
                                                                ? 'hidden'
                                                                : 'visible',
                                                    })
                                                }
                                                Object.assign(panel.style, {
                                                    left: `${x}px`,
                                                    top: `${y}px`,
                                                })
                                            },
                                        )
                                    },
                                )),
                                window.addEventListener('click', clickAway),
                                window.addEventListener(
                                    'keydown',
                                    keyEscape,
                                    !0,
                                )
                        }),
                        (panel.close = function () {
                            toggle(!1),
                                panel.trigger.setAttribute('aria-expanded', !1),
                                config.component.trap &&
                                    panel.setAttribute('x-trap', !1),
                                cleanup(),
                                window.removeEventListener('click', clickAway),
                                window.removeEventListener(
                                    'keydown',
                                    keyEscape,
                                    !1,
                                )
                        }),
                        (panel.toggle = function (event) {
                            panel._x_isShown ? panel.close() : panel.open(event)
                        })
                },
            )
    }
    var module_default = src_default
    var candidateSelectors = [
            'input',
            'select',
            'textarea',
            'a[href]',
            'button',
            '[tabindex]',
            'audio[controls]',
            'video[controls]',
            '[contenteditable]:not([contenteditable="false"])',
            'details>summary:first-of-type',
            'details',
        ],
        candidateSelector = candidateSelectors.join(','),
        matches =
            typeof Element == 'undefined'
                ? function () {}
                : Element.prototype.matches ||
                  Element.prototype.msMatchesSelector ||
                  Element.prototype.webkitMatchesSelector,
        getCandidates = function (el, includeContainer, filter) {
            var candidates = Array.prototype.slice.apply(
                el.querySelectorAll(candidateSelector),
            )
            return (
                includeContainer &&
                    matches.call(el, candidateSelector) &&
                    candidates.unshift(el),
                (candidates = candidates.filter(filter)),
                candidates
            )
        },
        isContentEditable = function (node) {
            return node.contentEditable === 'true'
        },
        getTabindex = function (node) {
            var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10)
            return isNaN(tabindexAttr)
                ? isContentEditable(node) ||
                  ((node.nodeName === 'AUDIO' ||
                      node.nodeName === 'VIDEO' ||
                      node.nodeName === 'DETAILS') &&
                      node.getAttribute('tabindex') === null)
                    ? 0
                    : node.tabIndex
                : tabindexAttr
        },
        sortOrderedTabbables = function (a, b) {
            return a.tabIndex === b.tabIndex
                ? a.documentOrder - b.documentOrder
                : a.tabIndex - b.tabIndex
        },
        isInput = function (node) {
            return node.tagName === 'INPUT'
        },
        isHiddenInput = function (node) {
            return isInput(node) && node.type === 'hidden'
        },
        isDetailsWithSummary = function (node) {
            var r =
                node.tagName === 'DETAILS' &&
                Array.prototype.slice
                    .apply(node.children)
                    .some(function (child) {
                        return child.tagName === 'SUMMARY'
                    })
            return r
        },
        getCheckedRadio = function (nodes, form) {
            for (var i = 0; i < nodes.length; i++)
                if (nodes[i].checked && nodes[i].form === form) return nodes[i]
        },
        isTabbableRadio = function (node) {
            if (!node.name) return !0
            var radioScope = node.form || node.ownerDocument,
                queryRadios = function (name) {
                    return radioScope.querySelectorAll(
                        'input[type="radio"][name="' + name + '"]',
                    )
                },
                radioSet
            if (
                typeof window != 'undefined' &&
                typeof window.CSS != 'undefined' &&
                typeof window.CSS.escape == 'function'
            )
                radioSet = queryRadios(window.CSS.escape(node.name))
            else
                try {
                    radioSet = queryRadios(node.name)
                } catch (err) {
                    return (
                        console.error(
                            'Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s',
                            err.message,
                        ),
                        !1
                    )
                }
            var checked = getCheckedRadio(radioSet, node.form)
            return !checked || checked === node
        },
        isRadio = function (node) {
            return isInput(node) && node.type === 'radio'
        },
        isNonTabbableRadio = function (node) {
            return isRadio(node) && !isTabbableRadio(node)
        },
        isHidden = function (node, displayCheck) {
            if (getComputedStyle(node).visibility === 'hidden') return !0
            var isDirectSummary = matches.call(
                    node,
                    'details>summary:first-of-type',
                ),
                nodeUnderDetails = isDirectSummary ? node.parentElement : node
            if (matches.call(nodeUnderDetails, 'details:not([open]) *'))
                return !0
            if (!displayCheck || displayCheck === 'full')
                for (; node; ) {
                    if (getComputedStyle(node).display === 'none') return !0
                    node = node.parentElement
                }
            else if (displayCheck === 'non-zero-area') {
                var _node$getBoundingClie = node.getBoundingClientRect(),
                    width = _node$getBoundingClie.width,
                    height = _node$getBoundingClie.height
                return width === 0 && height === 0
            }
            return !1
        },
        isDisabledFromFieldset = function (node) {
            if (
                isInput(node) ||
                node.tagName === 'SELECT' ||
                node.tagName === 'TEXTAREA' ||
                node.tagName === 'BUTTON'
            )
                for (var parentNode = node.parentElement; parentNode; ) {
                    if (
                        parentNode.tagName === 'FIELDSET' &&
                        parentNode.disabled
                    ) {
                        for (var i = 0; i < parentNode.children.length; i++) {
                            var child = parentNode.children.item(i)
                            if (child.tagName === 'LEGEND')
                                return !child.contains(node)
                        }
                        return !0
                    }
                    parentNode = parentNode.parentElement
                }
            return !1
        },
        isNodeMatchingSelectorFocusable = function (options, node) {
            return !(
                node.disabled ||
                isHiddenInput(node) ||
                isHidden(node, options.displayCheck) ||
                isDetailsWithSummary(node) ||
                isDisabledFromFieldset(node)
            )
        },
        isNodeMatchingSelectorTabbable = function (options, node) {
            return !(
                !isNodeMatchingSelectorFocusable(options, node) ||
                isNonTabbableRadio(node) ||
                getTabindex(node) < 0
            )
        },
        tabbable = function (el, options) {
            options = options || {}
            var regularTabbables = [],
                orderedTabbables = [],
                candidates = getCandidates(
                    el,
                    options.includeContainer,
                    isNodeMatchingSelectorTabbable.bind(null, options),
                )
            candidates.forEach(function (candidate, i) {
                var candidateTabindex = getTabindex(candidate)
                candidateTabindex === 0
                    ? regularTabbables.push(candidate)
                    : orderedTabbables.push({
                          documentOrder: i,
                          tabIndex: candidateTabindex,
                          node: candidate,
                      })
            })
            var tabbableNodes = orderedTabbables
                .sort(sortOrderedTabbables)
                .map(function (a) {
                    return a.node
                })
                .concat(regularTabbables)
            return tabbableNodes
        },
        focusable = function (el, options) {
            options = options || {}
            var candidates = getCandidates(
                el,
                options.includeContainer,
                isNodeMatchingSelectorFocusable.bind(null, options),
            )
            return candidates
        },
        focusableCandidateSelector = candidateSelectors
            .concat('iframe')
            .join(','),
        isFocusable = function (node, options) {
            if (((options = options || {}), !node))
                throw new Error('No node provided')
            return matches.call(node, focusableCandidateSelector) === !1
                ? !1
                : isNodeMatchingSelectorFocusable(options, node)
        }
    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object)
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object)
            enumerableOnly &&
                (symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym,
                    ).enumerable
                })),
                keys.push.apply(keys, symbols)
        }
        return keys
    }
    function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {}
            i % 2
                ? ownKeys(Object(source), !0).forEach(function (key) {
                      _defineProperty(target, key, source[key])
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                      target,
                      Object.getOwnPropertyDescriptors(source),
                  )
                : ownKeys(Object(source)).forEach(function (key) {
                      Object.defineProperty(
                          target,
                          key,
                          Object.getOwnPropertyDescriptor(source, key),
                      )
                  })
        }
        return target
    }
    function _defineProperty(obj, key, value) {
        return (
            key in obj
                ? Object.defineProperty(obj, key, {
                      value,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                  })
                : (obj[key] = value),
            obj
        )
    }
    var activeFocusTraps = (function () {
            var trapQueue = []
            return {
                activateTrap: function (trap) {
                    if (trapQueue.length > 0) {
                        var activeTrap = trapQueue[trapQueue.length - 1]
                        activeTrap !== trap && activeTrap.pause()
                    }
                    var trapIndex = trapQueue.indexOf(trap)
                    trapIndex === -1 || trapQueue.splice(trapIndex, 1),
                        trapQueue.push(trap)
                },
                deactivateTrap: function (trap) {
                    var trapIndex = trapQueue.indexOf(trap)
                    trapIndex !== -1 && trapQueue.splice(trapIndex, 1),
                        trapQueue.length > 0 &&
                            trapQueue[trapQueue.length - 1].unpause()
                },
            }
        })(),
        isSelectableInput = function (node) {
            return (
                node.tagName &&
                node.tagName.toLowerCase() === 'input' &&
                typeof node.select == 'function'
            )
        },
        isEscapeEvent = function (e) {
            return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27
        },
        isTabEvent = function (e) {
            return e.key === 'Tab' || e.keyCode === 9
        },
        delay = function (fn) {
            return setTimeout(fn, 0)
        },
        findIndex = function (arr, fn) {
            var idx = -1
            return (
                arr.every(function (value, i) {
                    return fn(value) ? ((idx = i), !1) : !0
                }),
                idx
            )
        },
        valueOrHandler = function (value) {
            for (
                var _len = arguments.length,
                    params = new Array(_len > 1 ? _len - 1 : 0),
                    _key = 1;
                _key < _len;
                _key++
            )
                params[_key - 1] = arguments[_key]
            return typeof value == 'function'
                ? value.apply(void 0, params)
                : value
        },
        createFocusTrap = function (elements, userOptions) {
            var doc = document,
                config = _objectSpread2(
                    {
                        returnFocusOnDeactivate: !0,
                        escapeDeactivates: !0,
                        delayInitialFocus: !0,
                    },
                    userOptions,
                ),
                state = {
                    containers: [],
                    tabbableGroups: [],
                    nodeFocusedBeforeActivation: null,
                    mostRecentlyFocusedNode: null,
                    active: !1,
                    paused: !1,
                    delayInitialFocusTimer: void 0,
                },
                trap,
                getOption = function (
                    configOverrideOptions,
                    optionName,
                    configOptionName,
                ) {
                    return configOverrideOptions &&
                        configOverrideOptions[optionName] !== void 0
                        ? configOverrideOptions[optionName]
                        : config[configOptionName || optionName]
                },
                containersContain = function (element) {
                    return state.containers.some(function (container) {
                        return container.contains(element)
                    })
                },
                getNodeForOption = function (optionName) {
                    var optionValue = config[optionName]
                    if (!optionValue) return null
                    var node = optionValue
                    if (
                        typeof optionValue == 'string' &&
                        ((node = doc.querySelector(optionValue)), !node)
                    )
                        throw new Error(
                            '`'.concat(optionName, '` refers to no known node'),
                        )
                    if (
                        typeof optionValue == 'function' &&
                        ((node = optionValue()), !node)
                    )
                        throw new Error(
                            '`'.concat(optionName, '` did not return a node'),
                        )
                    return node
                },
                getInitialFocusNode = function () {
                    var node
                    if (getOption({}, 'initialFocus') === !1) return !1
                    if (getNodeForOption('initialFocus') !== null)
                        node = getNodeForOption('initialFocus')
                    else if (containersContain(doc.activeElement))
                        node = doc.activeElement
                    else {
                        var firstTabbableGroup = state.tabbableGroups[0],
                            firstTabbableNode =
                                firstTabbableGroup &&
                                firstTabbableGroup.firstTabbableNode
                        node =
                            firstTabbableNode ||
                            getNodeForOption('fallbackFocus')
                    }
                    if (!node)
                        throw new Error(
                            'Your focus-trap needs to have at least one focusable element',
                        )
                    return node
                },
                updateTabbableNodes = function () {
                    if (
                        ((state.tabbableGroups = state.containers
                            .map(function (container) {
                                var tabbableNodes = tabbable(container)
                                if (tabbableNodes.length > 0)
                                    return {
                                        container,
                                        firstTabbableNode: tabbableNodes[0],
                                        lastTabbableNode:
                                            tabbableNodes[
                                                tabbableNodes.length - 1
                                            ],
                                    }
                            })
                            .filter(function (group) {
                                return !!group
                            })),
                        state.tabbableGroups.length <= 0 &&
                            !getNodeForOption('fallbackFocus'))
                    )
                        throw new Error(
                            'Your focus-trap must have at least one container with at least one tabbable node in it at all times',
                        )
                },
                tryFocus = function tryFocus2(node) {
                    if (node !== !1 && node !== doc.activeElement) {
                        if (!node || !node.focus) {
                            tryFocus2(getInitialFocusNode())
                            return
                        }
                        node.focus({ preventScroll: !!config.preventScroll }),
                            (state.mostRecentlyFocusedNode = node),
                            isSelectableInput(node) && node.select()
                    }
                },
                getReturnFocusNode = function (previousActiveElement) {
                    var node = getNodeForOption('setReturnFocus')
                    return node || previousActiveElement
                },
                checkPointerDown = function (e) {
                    if (!containersContain(e.target)) {
                        if (valueOrHandler(config.clickOutsideDeactivates, e)) {
                            trap.deactivate({
                                returnFocus:
                                    config.returnFocusOnDeactivate &&
                                    !isFocusable(e.target),
                            })
                            return
                        }
                        valueOrHandler(config.allowOutsideClick, e) ||
                            e.preventDefault()
                    }
                },
                checkFocusIn = function (e) {
                    var targetContained = containersContain(e.target)
                    targetContained || e.target instanceof Document
                        ? targetContained &&
                          (state.mostRecentlyFocusedNode = e.target)
                        : (e.stopImmediatePropagation(),
                          tryFocus(
                              state.mostRecentlyFocusedNode ||
                                  getInitialFocusNode(),
                          ))
                },
                checkTab = function (e) {
                    updateTabbableNodes()
                    var destinationNode = null
                    if (state.tabbableGroups.length > 0) {
                        var containerIndex = findIndex(
                            state.tabbableGroups,
                            function (_ref) {
                                var container = _ref.container
                                return container.contains(e.target)
                            },
                        )
                        if (containerIndex < 0)
                            e.shiftKey
                                ? (destinationNode =
                                      state.tabbableGroups[
                                          state.tabbableGroups.length - 1
                                      ].lastTabbableNode)
                                : (destinationNode =
                                      state.tabbableGroups[0].firstTabbableNode)
                        else if (e.shiftKey) {
                            var startOfGroupIndex = findIndex(
                                state.tabbableGroups,
                                function (_ref2) {
                                    var firstTabbableNode =
                                        _ref2.firstTabbableNode
                                    return e.target === firstTabbableNode
                                },
                            )
                            if (
                                (startOfGroupIndex < 0 &&
                                    state.tabbableGroups[containerIndex]
                                        .container === e.target &&
                                    (startOfGroupIndex = containerIndex),
                                startOfGroupIndex >= 0)
                            ) {
                                var destinationGroupIndex =
                                        startOfGroupIndex === 0
                                            ? state.tabbableGroups.length - 1
                                            : startOfGroupIndex - 1,
                                    destinationGroup =
                                        state.tabbableGroups[
                                            destinationGroupIndex
                                        ]
                                destinationNode =
                                    destinationGroup.lastTabbableNode
                            }
                        } else {
                            var lastOfGroupIndex = findIndex(
                                state.tabbableGroups,
                                function (_ref3) {
                                    var lastTabbableNode =
                                        _ref3.lastTabbableNode
                                    return e.target === lastTabbableNode
                                },
                            )
                            if (
                                (lastOfGroupIndex < 0 &&
                                    state.tabbableGroups[containerIndex]
                                        .container === e.target &&
                                    (lastOfGroupIndex = containerIndex),
                                lastOfGroupIndex >= 0)
                            ) {
                                var _destinationGroupIndex =
                                        lastOfGroupIndex ===
                                        state.tabbableGroups.length - 1
                                            ? 0
                                            : lastOfGroupIndex + 1,
                                    _destinationGroup =
                                        state.tabbableGroups[
                                            _destinationGroupIndex
                                        ]
                                destinationNode =
                                    _destinationGroup.firstTabbableNode
                            }
                        }
                    } else destinationNode = getNodeForOption('fallbackFocus')
                    destinationNode &&
                        (e.preventDefault(), tryFocus(destinationNode))
                },
                checkKey = function (e) {
                    if (
                        isEscapeEvent(e) &&
                        valueOrHandler(config.escapeDeactivates) !== !1
                    ) {
                        e.preventDefault(), trap.deactivate()
                        return
                    }
                    if (isTabEvent(e)) {
                        checkTab(e)
                        return
                    }
                },
                checkClick = function (e) {
                    valueOrHandler(config.clickOutsideDeactivates, e) ||
                        containersContain(e.target) ||
                        valueOrHandler(config.allowOutsideClick, e) ||
                        (e.preventDefault(), e.stopImmediatePropagation())
                },
                addListeners = function () {
                    if (!!state.active)
                        return (
                            activeFocusTraps.activateTrap(trap),
                            (state.delayInitialFocusTimer =
                                config.delayInitialFocus
                                    ? delay(function () {
                                          tryFocus(getInitialFocusNode())
                                      })
                                    : tryFocus(getInitialFocusNode())),
                            doc.addEventListener('focusin', checkFocusIn, !0),
                            doc.addEventListener(
                                'mousedown',
                                checkPointerDown,
                                { capture: !0, passive: !1 },
                            ),
                            doc.addEventListener(
                                'touchstart',
                                checkPointerDown,
                                { capture: !0, passive: !1 },
                            ),
                            doc.addEventListener('click', checkClick, {
                                capture: !0,
                                passive: !1,
                            }),
                            doc.addEventListener('keydown', checkKey, {
                                capture: !0,
                                passive: !1,
                            }),
                            trap
                        )
                },
                removeListeners = function () {
                    if (!!state.active)
                        return (
                            doc.removeEventListener(
                                'focusin',
                                checkFocusIn,
                                !0,
                            ),
                            doc.removeEventListener(
                                'mousedown',
                                checkPointerDown,
                                !0,
                            ),
                            doc.removeEventListener(
                                'touchstart',
                                checkPointerDown,
                                !0,
                            ),
                            doc.removeEventListener('click', checkClick, !0),
                            doc.removeEventListener('keydown', checkKey, !0),
                            trap
                        )
                }
            return (
                (trap = {
                    activate: function (activateOptions) {
                        if (state.active) return this
                        var onActivate = getOption(
                                activateOptions,
                                'onActivate',
                            ),
                            onPostActivate = getOption(
                                activateOptions,
                                'onPostActivate',
                            ),
                            checkCanFocusTrap = getOption(
                                activateOptions,
                                'checkCanFocusTrap',
                            )
                        checkCanFocusTrap || updateTabbableNodes(),
                            (state.active = !0),
                            (state.paused = !1),
                            (state.nodeFocusedBeforeActivation =
                                doc.activeElement),
                            onActivate && onActivate()
                        var finishActivation = function () {
                            checkCanFocusTrap && updateTabbableNodes(),
                                addListeners(),
                                onPostActivate && onPostActivate()
                        }
                        return checkCanFocusTrap
                            ? (checkCanFocusTrap(
                                  state.containers.concat(),
                              ).then(finishActivation, finishActivation),
                              this)
                            : (finishActivation(), this)
                    },
                    deactivate: function (deactivateOptions) {
                        if (!state.active) return this
                        clearTimeout(state.delayInitialFocusTimer),
                            (state.delayInitialFocusTimer = void 0),
                            removeListeners(),
                            (state.active = !1),
                            (state.paused = !1),
                            activeFocusTraps.deactivateTrap(trap)
                        var onDeactivate = getOption(
                                deactivateOptions,
                                'onDeactivate',
                            ),
                            onPostDeactivate = getOption(
                                deactivateOptions,
                                'onPostDeactivate',
                            ),
                            checkCanReturnFocus = getOption(
                                deactivateOptions,
                                'checkCanReturnFocus',
                            )
                        onDeactivate && onDeactivate()
                        var returnFocus = getOption(
                                deactivateOptions,
                                'returnFocus',
                                'returnFocusOnDeactivate',
                            ),
                            finishDeactivation = function () {
                                delay(function () {
                                    returnFocus &&
                                        tryFocus(
                                            getReturnFocusNode(
                                                state.nodeFocusedBeforeActivation,
                                            ),
                                        ),
                                        onPostDeactivate && onPostDeactivate()
                                })
                            }
                        return returnFocus && checkCanReturnFocus
                            ? (checkCanReturnFocus(
                                  getReturnFocusNode(
                                      state.nodeFocusedBeforeActivation,
                                  ),
                              ).then(finishDeactivation, finishDeactivation),
                              this)
                            : (finishDeactivation(), this)
                    },
                    pause: function () {
                        return state.paused || !state.active
                            ? this
                            : ((state.paused = !0), removeListeners(), this)
                    },
                    unpause: function () {
                        return !state.paused || !state.active
                            ? this
                            : ((state.paused = !1),
                              updateTabbableNodes(),
                              addListeners(),
                              this)
                    },
                    updateContainerElements: function (containerElements) {
                        var elementsAsArray = []
                            .concat(containerElements)
                            .filter(Boolean)
                        return (
                            (state.containers = elementsAsArray.map(function (
                                element,
                            ) {
                                return typeof element == 'string'
                                    ? doc.querySelector(element)
                                    : element
                            })),
                            state.active && updateTabbableNodes(),
                            this
                        )
                    },
                }),
                trap.updateContainerElements(elements),
                trap
            )
        }
    function src_default2(Alpine) {
        let lastFocused, currentFocused
        window.addEventListener('focusin', () => {
            ;(lastFocused = currentFocused),
                (currentFocused = document.activeElement)
        }),
            Alpine.magic('focus', (el) => {
                let within2 = el
                return {
                    __noscroll: !1,
                    __wrapAround: !1,
                    within(el2) {
                        return (within2 = el2), this
                    },
                    withoutScrolling() {
                        return (this.__noscroll = !0), this
                    },
                    noscroll() {
                        return (this.__noscroll = !0), this
                    },
                    withWrapAround() {
                        return (this.__wrapAround = !0), this
                    },
                    wrap() {
                        return this.withWrapAround()
                    },
                    focusable(el2) {
                        return isFocusable(el2)
                    },
                    previouslyFocused() {
                        return lastFocused
                    },
                    lastFocused() {
                        return lastFocused
                    },
                    focused() {
                        return currentFocused
                    },
                    focusables() {
                        return Array.isArray(within2)
                            ? within2
                            : focusable(within2, { displayCheck: 'none' })
                    },
                    all() {
                        return this.focusables()
                    },
                    isFirst(el2) {
                        let els = this.all()
                        return els[0] && els[0].isSameNode(el2)
                    },
                    isLast(el2) {
                        let els = this.all()
                        return els.length && els.slice(-1)[0].isSameNode(el2)
                    },
                    getFirst() {
                        return this.all()[0]
                    },
                    getLast() {
                        return this.all().slice(-1)[0]
                    },
                    getNext() {
                        let list = this.all(),
                            current = document.activeElement
                        if (list.indexOf(current) !== -1)
                            return this.__wrapAround &&
                                list.indexOf(current) === list.length - 1
                                ? list[0]
                                : list[list.indexOf(current) + 1]
                    },
                    getPrevious() {
                        let list = this.all(),
                            current = document.activeElement
                        if (list.indexOf(current) !== -1)
                            return this.__wrapAround &&
                                list.indexOf(current) === 0
                                ? list.slice(-1)[0]
                                : list[list.indexOf(current) - 1]
                    },
                    first() {
                        this.focus(this.getFirst())
                    },
                    last() {
                        this.focus(this.getLast())
                    },
                    next() {
                        this.focus(this.getNext())
                    },
                    previous() {
                        this.focus(this.getPrevious())
                    },
                    prev() {
                        return this.previous()
                    },
                    focus(el2) {
                        !el2 ||
                            setTimeout(() => {
                                el2.hasAttribute('tabindex') ||
                                    el2.setAttribute('tabindex', '0'),
                                    el2.focus({ preventScroll: this._noscroll })
                            })
                    },
                }
            }),
            Alpine.directive(
                'trap',
                Alpine.skipDuringClone(
                    (
                        el,
                        { expression, modifiers },
                        { effect, evaluateLater, cleanup },
                    ) => {
                        let evaluator = evaluateLater(expression),
                            oldValue = !1,
                            trap = createFocusTrap(el, {
                                escapeDeactivates: !1,
                                allowOutsideClick: !0,
                                fallbackFocus: () => el,
                                initialFocus: el.querySelector('[autofocus]'),
                            }),
                            undoInert = () => {},
                            undoDisableScrolling = () => {},
                            releaseFocus = () => {
                                undoInert(),
                                    (undoInert = () => {}),
                                    undoDisableScrolling(),
                                    (undoDisableScrolling = () => {}),
                                    trap.deactivate({
                                        returnFocus:
                                            !modifiers.includes('noreturn'),
                                    })
                            }
                        effect(() =>
                            evaluator((value) => {
                                oldValue !== value &&
                                    (value &&
                                        !oldValue &&
                                        setTimeout(() => {
                                            modifiers.includes('inert') &&
                                                (undoInert = setInert(el)),
                                                modifiers.includes(
                                                    'noscroll',
                                                ) &&
                                                    (undoDisableScrolling =
                                                        disableScrolling()),
                                                trap.activate()
                                        }),
                                    !value && oldValue && releaseFocus(),
                                    (oldValue = !!value))
                            }),
                        ),
                            cleanup(releaseFocus)
                    },
                    (el, { expression, modifiers }, { evaluate }) => {
                        modifiers.includes('inert') &&
                            evaluate(expression) &&
                            setInert(el)
                    },
                ),
            )
    }
    function setInert(el) {
        let undos = []
        return (
            crawlSiblingsUp(el, (sibling) => {
                let cache = sibling.hasAttribute('aria-hidden')
                sibling.setAttribute('aria-hidden', 'true'),
                    undos.push(
                        () => cache || sibling.removeAttribute('aria-hidden'),
                    )
            }),
            () => {
                for (; undos.length; ) undos.pop()()
            }
        )
    }
    function crawlSiblingsUp(el, callback) {
        el.isSameNode(document.body) ||
            !el.parentNode ||
            Array.from(el.parentNode.children).forEach((sibling) => {
                sibling.isSameNode(el)
                    ? crawlSiblingsUp(el.parentNode, callback)
                    : callback(sibling)
            })
    }
    function disableScrolling() {
        let overflow = document.documentElement.style.overflow,
            paddingRight = document.documentElement.style.paddingRight,
            scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth
        return (
            (document.documentElement.style.overflow = 'hidden'),
            (document.documentElement.style.paddingRight = `${scrollbarWidth}px`),
            () => {
                ;(document.documentElement.style.overflow = overflow),
                    (document.documentElement.style.paddingRight = paddingRight)
            }
        )
    }
    var module_default2 = src_default2
    function ownKeys2(object, enumerableOnly) {
        var keys = Object.keys(object)
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object)
            enumerableOnly &&
                (symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(
                        object,
                        sym,
                    ).enumerable
                })),
                keys.push.apply(keys, symbols)
        }
        return keys
    }
    function _objectSpread22(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {}
            i % 2
                ? ownKeys2(Object(source), !0).forEach(function (key) {
                      _defineProperty2(target, key, source[key])
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                      target,
                      Object.getOwnPropertyDescriptors(source),
                  )
                : ownKeys2(Object(source)).forEach(function (key) {
                      Object.defineProperty(
                          target,
                          key,
                          Object.getOwnPropertyDescriptor(source, key),
                      )
                  })
        }
        return target
    }
    function _typeof(obj) {
        return (
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
                ? (_typeof = function (obj2) {
                      return typeof obj2
                  })
                : (_typeof = function (obj2) {
                      return obj2 &&
                          typeof Symbol == 'function' &&
                          obj2.constructor === Symbol &&
                          obj2 !== Symbol.prototype
                          ? 'symbol'
                          : typeof obj2
                  }),
            _typeof(obj)
        )
    }
    function _defineProperty2(obj, key, value) {
        return (
            key in obj
                ? Object.defineProperty(obj, key, {
                      value,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                  })
                : (obj[key] = value),
            obj
        )
    }
    function _extends() {
        return (
            (_extends =
                Object.assign ||
                function (target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i]
                        for (var key in source)
                            Object.prototype.hasOwnProperty.call(source, key) &&
                                (target[key] = source[key])
                    }
                    return target
                }),
            _extends.apply(this, arguments)
        )
    }
    function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {}
        var target = {},
            sourceKeys = Object.keys(source),
            key,
            i
        for (i = 0; i < sourceKeys.length; i++)
            (key = sourceKeys[i]),
                !(excluded.indexOf(key) >= 0) && (target[key] = source[key])
        return target
    }
    function _objectWithoutProperties(source, excluded) {
        if (source == null) return {}
        var target = _objectWithoutPropertiesLoose(source, excluded),
            key,
            i
        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source)
            for (i = 0; i < sourceSymbolKeys.length; i++)
                (key = sourceSymbolKeys[i]),
                    !(excluded.indexOf(key) >= 0) &&
                        (!Object.prototype.propertyIsEnumerable.call(
                            source,
                            key,
                        ) ||
                            (target[key] = source[key]))
        }
        return target
    }
    var version = '1.15.0'
    function userAgent(pattern) {
        if (typeof window != 'undefined' && window.navigator)
            return !!navigator.userAgent.match(pattern)
    }
    var IE11OrLess = userAgent(
            /(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i,
        ),
        Edge = userAgent(/Edge/i),
        FireFox = userAgent(/firefox/i),
        Safari =
            userAgent(/safari/i) &&
            !userAgent(/chrome/i) &&
            !userAgent(/android/i),
        IOS = userAgent(/iP(ad|od|hone)/i),
        ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i),
        captureMode = { capture: !1, passive: !1 }
    function on(el, event, fn) {
        el.addEventListener(event, fn, !IE11OrLess && captureMode)
    }
    function off(el, event, fn) {
        el.removeEventListener(event, fn, !IE11OrLess && captureMode)
    }
    function matches2(el, selector) {
        if (!!selector) {
            if ((selector[0] === '>' && (selector = selector.substring(1)), el))
                try {
                    if (el.matches) return el.matches(selector)
                    if (el.msMatchesSelector)
                        return el.msMatchesSelector(selector)
                    if (el.webkitMatchesSelector)
                        return el.webkitMatchesSelector(selector)
                } catch (_) {
                    return !1
                }
            return !1
        }
    }
    function getParentOrHost(el) {
        return el.host && el !== document && el.host.nodeType
            ? el.host
            : el.parentNode
    }
    function closest(el, selector, ctx, includeCTX) {
        if (el) {
            ctx = ctx || document
            do {
                if (
                    (selector != null &&
                        (selector[0] === '>'
                            ? el.parentNode === ctx && matches2(el, selector)
                            : matches2(el, selector))) ||
                    (includeCTX && el === ctx)
                )
                    return el
                if (el === ctx) break
            } while ((el = getParentOrHost(el)))
        }
        return null
    }
    var R_SPACE = /\s+/g
    function toggleClass(el, name, state) {
        if (el && name)
            if (el.classList) el.classList[state ? 'add' : 'remove'](name)
            else {
                var className = (' ' + el.className + ' ')
                    .replace(R_SPACE, ' ')
                    .replace(' ' + name + ' ', ' ')
                el.className = (className + (state ? ' ' + name : '')).replace(
                    R_SPACE,
                    ' ',
                )
            }
    }
    function css(el, prop, val) {
        var style = el && el.style
        if (style) {
            if (val === void 0)
                return (
                    document.defaultView &&
                    document.defaultView.getComputedStyle
                        ? (val = document.defaultView.getComputedStyle(el, ''))
                        : el.currentStyle && (val = el.currentStyle),
                    prop === void 0 ? val : val[prop]
                )
            !(prop in style) &&
                prop.indexOf('webkit') === -1 &&
                (prop = '-webkit-' + prop),
                (style[prop] = val + (typeof val == 'string' ? '' : 'px'))
        }
    }
    function matrix(el, selfOnly) {
        var appliedTransforms = ''
        if (typeof el == 'string') appliedTransforms = el
        else
            do {
                var transform = css(el, 'transform')
                transform &&
                    transform !== 'none' &&
                    (appliedTransforms = transform + ' ' + appliedTransforms)
            } while (!selfOnly && (el = el.parentNode))
        var matrixFn =
            window.DOMMatrix ||
            window.WebKitCSSMatrix ||
            window.CSSMatrix ||
            window.MSCSSMatrix
        return matrixFn && new matrixFn(appliedTransforms)
    }
    function find(ctx, tagName, iterator) {
        if (ctx) {
            var list = ctx.getElementsByTagName(tagName),
                i = 0,
                n = list.length
            if (iterator) for (; i < n; i++) iterator(list[i], i)
            return list
        }
        return []
    }
    function getWindowScrollingElement() {
        var scrollingElement = document.scrollingElement
        return scrollingElement || document.documentElement
    }
    function getRect(
        el,
        relativeToContainingBlock,
        relativeToNonStaticParent,
        undoScale,
        container,
    ) {
        if (!(!el.getBoundingClientRect && el !== window)) {
            var elRect, top, left, bottom, right, height, width
            if (
                (el !== window &&
                el.parentNode &&
                el !== getWindowScrollingElement()
                    ? ((elRect = el.getBoundingClientRect()),
                      (top = elRect.top),
                      (left = elRect.left),
                      (bottom = elRect.bottom),
                      (right = elRect.right),
                      (height = elRect.height),
                      (width = elRect.width))
                    : ((top = 0),
                      (left = 0),
                      (bottom = window.innerHeight),
                      (right = window.innerWidth),
                      (height = window.innerHeight),
                      (width = window.innerWidth)),
                (relativeToContainingBlock || relativeToNonStaticParent) &&
                    el !== window &&
                    ((container = container || el.parentNode), !IE11OrLess))
            )
                do
                    if (
                        container &&
                        container.getBoundingClientRect &&
                        (css(container, 'transform') !== 'none' ||
                            (relativeToNonStaticParent &&
                                css(container, 'position') !== 'static'))
                    ) {
                        var containerRect = container.getBoundingClientRect()
                        ;(top -=
                            containerRect.top +
                            parseInt(css(container, 'border-top-width'))),
                            (left -=
                                containerRect.left +
                                parseInt(css(container, 'border-left-width'))),
                            (bottom = top + elRect.height),
                            (right = left + elRect.width)
                        break
                    }
                while ((container = container.parentNode))
            if (undoScale && el !== window) {
                var elMatrix = matrix(container || el),
                    scaleX = elMatrix && elMatrix.a,
                    scaleY = elMatrix && elMatrix.d
                elMatrix &&
                    ((top /= scaleY),
                    (left /= scaleX),
                    (width /= scaleX),
                    (height /= scaleY),
                    (bottom = top + height),
                    (right = left + width))
            }
            return { top, left, bottom, right, width, height }
        }
    }
    function isScrolledPast(el, elSide, parentSide) {
        for (
            var parent = getParentAutoScrollElement(el, !0),
                elSideVal = getRect(el)[elSide];
            parent;

        ) {
            var parentSideVal = getRect(parent)[parentSide],
                visible = void 0
            if (
                (parentSide === 'top' || parentSide === 'left'
                    ? (visible = elSideVal >= parentSideVal)
                    : (visible = elSideVal <= parentSideVal),
                !visible)
            )
                return parent
            if (parent === getWindowScrollingElement()) break
            parent = getParentAutoScrollElement(parent, !1)
        }
        return !1
    }
    function getChild(el, childNum, options, includeDragEl) {
        for (
            var currentChild = 0, i = 0, children = el.children;
            i < children.length;

        ) {
            if (
                children[i].style.display !== 'none' &&
                children[i] !== Sortable.ghost &&
                (includeDragEl || children[i] !== Sortable.dragged) &&
                closest(children[i], options.draggable, el, !1)
            ) {
                if (currentChild === childNum) return children[i]
                currentChild++
            }
            i++
        }
        return null
    }
    function lastChild(el, selector) {
        for (
            var last = el.lastElementChild;
            last &&
            (last === Sortable.ghost ||
                css(last, 'display') === 'none' ||
                (selector && !matches2(last, selector)));

        )
            last = last.previousElementSibling
        return last || null
    }
    function index(el, selector) {
        var index2 = 0
        if (!el || !el.parentNode) return -1
        for (; (el = el.previousElementSibling); )
            el.nodeName.toUpperCase() !== 'TEMPLATE' &&
                el !== Sortable.clone &&
                (!selector || matches2(el, selector)) &&
                index2++
        return index2
    }
    function getRelativeScrollOffset(el) {
        var offsetLeft = 0,
            offsetTop = 0,
            winScroller = getWindowScrollingElement()
        if (el)
            do {
                var elMatrix = matrix(el),
                    scaleX = elMatrix.a,
                    scaleY = elMatrix.d
                ;(offsetLeft += el.scrollLeft * scaleX),
                    (offsetTop += el.scrollTop * scaleY)
            } while (el !== winScroller && (el = el.parentNode))
        return [offsetLeft, offsetTop]
    }
    function indexOfObject(arr, obj) {
        for (var i in arr)
            if (!!arr.hasOwnProperty(i)) {
                for (var key in obj)
                    if (obj.hasOwnProperty(key) && obj[key] === arr[i][key])
                        return Number(i)
            }
        return -1
    }
    function getParentAutoScrollElement(el, includeSelf) {
        if (!el || !el.getBoundingClientRect) return getWindowScrollingElement()
        var elem = el,
            gotSelf = !1
        do
            if (
                elem.clientWidth < elem.scrollWidth ||
                elem.clientHeight < elem.scrollHeight
            ) {
                var elemCSS = css(elem)
                if (
                    (elem.clientWidth < elem.scrollWidth &&
                        (elemCSS.overflowX == 'auto' ||
                            elemCSS.overflowX == 'scroll')) ||
                    (elem.clientHeight < elem.scrollHeight &&
                        (elemCSS.overflowY == 'auto' ||
                            elemCSS.overflowY == 'scroll'))
                ) {
                    if (!elem.getBoundingClientRect || elem === document.body)
                        return getWindowScrollingElement()
                    if (gotSelf || includeSelf) return elem
                    gotSelf = !0
                }
            }
        while ((elem = elem.parentNode))
        return getWindowScrollingElement()
    }
    function extend(dst, src) {
        if (dst && src)
            for (var key in src)
                src.hasOwnProperty(key) && (dst[key] = src[key])
        return dst
    }
    function isRectEqual(rect1, rect2) {
        return (
            Math.round(rect1.top) === Math.round(rect2.top) &&
            Math.round(rect1.left) === Math.round(rect2.left) &&
            Math.round(rect1.height) === Math.round(rect2.height) &&
            Math.round(rect1.width) === Math.round(rect2.width)
        )
    }
    var _throttleTimeout
    function throttle(callback, ms) {
        return function () {
            if (!_throttleTimeout) {
                var args = arguments,
                    _this = this
                args.length === 1
                    ? callback.call(_this, args[0])
                    : callback.apply(_this, args),
                    (_throttleTimeout = setTimeout(function () {
                        _throttleTimeout = void 0
                    }, ms))
            }
        }
    }
    function cancelThrottle() {
        clearTimeout(_throttleTimeout), (_throttleTimeout = void 0)
    }
    function scrollBy(el, x, y) {
        ;(el.scrollLeft += x), (el.scrollTop += y)
    }
    function clone(el) {
        var Polymer = window.Polymer,
            $ = window.jQuery || window.Zepto
        return Polymer && Polymer.dom
            ? Polymer.dom(el).cloneNode(!0)
            : $
            ? $(el).clone(!0)[0]
            : el.cloneNode(!0)
    }
    var expando = 'Sortable' + new Date().getTime()
    function AnimationStateManager() {
        var animationStates = [],
            animationCallbackId
        return {
            captureAnimationState: function () {
                if (((animationStates = []), !!this.options.animation)) {
                    var children = [].slice.call(this.el.children)
                    children.forEach(function (child) {
                        if (
                            !(
                                css(child, 'display') === 'none' ||
                                child === Sortable.ghost
                            )
                        ) {
                            animationStates.push({
                                target: child,
                                rect: getRect(child),
                            })
                            var fromRect = _objectSpread22(
                                {},
                                animationStates[animationStates.length - 1]
                                    .rect,
                            )
                            if (child.thisAnimationDuration) {
                                var childMatrix = matrix(child, !0)
                                childMatrix &&
                                    ((fromRect.top -= childMatrix.f),
                                    (fromRect.left -= childMatrix.e))
                            }
                            child.fromRect = fromRect
                        }
                    })
                }
            },
            addAnimationState: function (state) {
                animationStates.push(state)
            },
            removeAnimationState: function (target) {
                animationStates.splice(
                    indexOfObject(animationStates, { target }),
                    1,
                )
            },
            animateAll: function (callback) {
                var _this = this
                if (!this.options.animation) {
                    clearTimeout(animationCallbackId),
                        typeof callback == 'function' && callback()
                    return
                }
                var animating = !1,
                    animationTime = 0
                animationStates.forEach(function (state) {
                    var time = 0,
                        target = state.target,
                        fromRect = target.fromRect,
                        toRect = getRect(target),
                        prevFromRect = target.prevFromRect,
                        prevToRect = target.prevToRect,
                        animatingRect = state.rect,
                        targetMatrix = matrix(target, !0)
                    targetMatrix &&
                        ((toRect.top -= targetMatrix.f),
                        (toRect.left -= targetMatrix.e)),
                        (target.toRect = toRect),
                        target.thisAnimationDuration &&
                            isRectEqual(prevFromRect, toRect) &&
                            !isRectEqual(fromRect, toRect) &&
                            (animatingRect.top - toRect.top) /
                                (animatingRect.left - toRect.left) ==
                                (fromRect.top - toRect.top) /
                                    (fromRect.left - toRect.left) &&
                            (time = calculateRealTime(
                                animatingRect,
                                prevFromRect,
                                prevToRect,
                                _this.options,
                            )),
                        isRectEqual(toRect, fromRect) ||
                            ((target.prevFromRect = fromRect),
                            (target.prevToRect = toRect),
                            time || (time = _this.options.animation),
                            _this.animate(target, animatingRect, toRect, time)),
                        time &&
                            ((animating = !0),
                            (animationTime = Math.max(animationTime, time)),
                            clearTimeout(target.animationResetTimer),
                            (target.animationResetTimer = setTimeout(
                                function () {
                                    ;(target.animationTime = 0),
                                        (target.prevFromRect = null),
                                        (target.fromRect = null),
                                        (target.prevToRect = null),
                                        (target.thisAnimationDuration = null)
                                },
                                time,
                            )),
                            (target.thisAnimationDuration = time))
                }),
                    clearTimeout(animationCallbackId),
                    animating
                        ? (animationCallbackId = setTimeout(function () {
                              typeof callback == 'function' && callback()
                          }, animationTime))
                        : typeof callback == 'function' && callback(),
                    (animationStates = [])
            },
            animate: function (target, currentRect, toRect, duration) {
                if (duration) {
                    css(target, 'transition', ''), css(target, 'transform', '')
                    var elMatrix = matrix(this.el),
                        scaleX = elMatrix && elMatrix.a,
                        scaleY = elMatrix && elMatrix.d,
                        translateX =
                            (currentRect.left - toRect.left) / (scaleX || 1),
                        translateY =
                            (currentRect.top - toRect.top) / (scaleY || 1)
                    ;(target.animatingX = !!translateX),
                        (target.animatingY = !!translateY),
                        css(
                            target,
                            'transform',
                            'translate3d(' +
                                translateX +
                                'px,' +
                                translateY +
                                'px,0)',
                        ),
                        (this.forRepaintDummy = repaint(target)),
                        css(
                            target,
                            'transition',
                            'transform ' +
                                duration +
                                'ms' +
                                (this.options.easing
                                    ? ' ' + this.options.easing
                                    : ''),
                        ),
                        css(target, 'transform', 'translate3d(0,0,0)'),
                        typeof target.animated == 'number' &&
                            clearTimeout(target.animated),
                        (target.animated = setTimeout(function () {
                            css(target, 'transition', ''),
                                css(target, 'transform', ''),
                                (target.animated = !1),
                                (target.animatingX = !1),
                                (target.animatingY = !1)
                        }, duration))
                }
            },
        }
    }
    function repaint(target) {
        return target.offsetWidth
    }
    function calculateRealTime(animatingRect, fromRect, toRect, options) {
        return (
            (Math.sqrt(
                Math.pow(fromRect.top - animatingRect.top, 2) +
                    Math.pow(fromRect.left - animatingRect.left, 2),
            ) /
                Math.sqrt(
                    Math.pow(fromRect.top - toRect.top, 2) +
                        Math.pow(fromRect.left - toRect.left, 2),
                )) *
            options.animation
        )
    }
    var plugins = [],
        defaults = { initializeByDefault: !0 },
        PluginManager = {
            mount: function (plugin) {
                for (var option2 in defaults)
                    defaults.hasOwnProperty(option2) &&
                        !(option2 in plugin) &&
                        (plugin[option2] = defaults[option2])
                plugins.forEach(function (p) {
                    if (p.pluginName === plugin.pluginName)
                        throw 'Sortable: Cannot mount plugin '.concat(
                            plugin.pluginName,
                            ' more than once',
                        )
                }),
                    plugins.push(plugin)
            },
            pluginEvent: function (eventName, sortable, evt) {
                var _this = this
                ;(this.eventCanceled = !1),
                    (evt.cancel = function () {
                        _this.eventCanceled = !0
                    })
                var eventNameGlobal = eventName + 'Global'
                plugins.forEach(function (plugin) {
                    !sortable[plugin.pluginName] ||
                        (sortable[plugin.pluginName][eventNameGlobal] &&
                            sortable[plugin.pluginName][eventNameGlobal](
                                _objectSpread22({ sortable }, evt),
                            ),
                        sortable.options[plugin.pluginName] &&
                            sortable[plugin.pluginName][eventName] &&
                            sortable[plugin.pluginName][eventName](
                                _objectSpread22({ sortable }, evt),
                            ))
                })
            },
            initializePlugins: function (sortable, el, defaults2, options) {
                plugins.forEach(function (plugin) {
                    var pluginName = plugin.pluginName
                    if (
                        !(
                            !sortable.options[pluginName] &&
                            !plugin.initializeByDefault
                        )
                    ) {
                        var initialized = new plugin(
                            sortable,
                            el,
                            sortable.options,
                        )
                        ;(initialized.sortable = sortable),
                            (initialized.options = sortable.options),
                            (sortable[pluginName] = initialized),
                            _extends(defaults2, initialized.defaults)
                    }
                })
                for (var option2 in sortable.options)
                    if (!!sortable.options.hasOwnProperty(option2)) {
                        var modified = this.modifyOption(
                            sortable,
                            option2,
                            sortable.options[option2],
                        )
                        typeof modified != 'undefined' &&
                            (sortable.options[option2] = modified)
                    }
            },
            getEventProperties: function (name, sortable) {
                var eventProperties = {}
                return (
                    plugins.forEach(function (plugin) {
                        typeof plugin.eventProperties == 'function' &&
                            _extends(
                                eventProperties,
                                plugin.eventProperties.call(
                                    sortable[plugin.pluginName],
                                    name,
                                ),
                            )
                    }),
                    eventProperties
                )
            },
            modifyOption: function (sortable, name, value) {
                var modifiedValue
                return (
                    plugins.forEach(function (plugin) {
                        !sortable[plugin.pluginName] ||
                            (plugin.optionListeners &&
                                typeof plugin.optionListeners[name] ==
                                    'function' &&
                                (modifiedValue = plugin.optionListeners[
                                    name
                                ].call(sortable[plugin.pluginName], value)))
                    }),
                    modifiedValue
                )
            },
        }
    function dispatchEvent(_ref) {
        var sortable = _ref.sortable,
            rootEl2 = _ref.rootEl,
            name = _ref.name,
            targetEl = _ref.targetEl,
            cloneEl2 = _ref.cloneEl,
            toEl = _ref.toEl,
            fromEl = _ref.fromEl,
            oldIndex2 = _ref.oldIndex,
            newIndex2 = _ref.newIndex,
            oldDraggableIndex2 = _ref.oldDraggableIndex,
            newDraggableIndex2 = _ref.newDraggableIndex,
            originalEvent = _ref.originalEvent,
            putSortable2 = _ref.putSortable,
            extraEventProperties = _ref.extraEventProperties
        if (
            ((sortable = sortable || (rootEl2 && rootEl2[expando])), !!sortable)
        ) {
            var evt,
                options = sortable.options,
                onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1)
            window.CustomEvent && !IE11OrLess && !Edge
                ? (evt = new CustomEvent(name, { bubbles: !0, cancelable: !0 }))
                : ((evt = document.createEvent('Event')),
                  evt.initEvent(name, !0, !0)),
                (evt.to = toEl || rootEl2),
                (evt.from = fromEl || rootEl2),
                (evt.item = targetEl || rootEl2),
                (evt.clone = cloneEl2),
                (evt.oldIndex = oldIndex2),
                (evt.newIndex = newIndex2),
                (evt.oldDraggableIndex = oldDraggableIndex2),
                (evt.newDraggableIndex = newDraggableIndex2),
                (evt.originalEvent = originalEvent),
                (evt.pullMode = putSortable2
                    ? putSortable2.lastPutMode
                    : void 0)
            var allEventProperties = _objectSpread22(
                _objectSpread22({}, extraEventProperties),
                PluginManager.getEventProperties(name, sortable),
            )
            for (var option2 in allEventProperties)
                evt[option2] = allEventProperties[option2]
            rootEl2 && rootEl2.dispatchEvent(evt),
                options[onName] && options[onName].call(sortable, evt)
        }
    }
    var _excluded = ['evt'],
        pluginEvent2 = function (eventName, sortable) {
            var _ref =
                    arguments.length > 2 && arguments[2] !== void 0
                        ? arguments[2]
                        : {},
                originalEvent = _ref.evt,
                data = _objectWithoutProperties(_ref, _excluded)
            PluginManager.pluginEvent.bind(Sortable)(
                eventName,
                sortable,
                _objectSpread22(
                    {
                        dragEl,
                        parentEl,
                        ghostEl,
                        rootEl,
                        nextEl,
                        lastDownEl,
                        cloneEl,
                        cloneHidden,
                        dragStarted: moved,
                        putSortable,
                        activeSortable: Sortable.active,
                        originalEvent,
                        oldIndex,
                        oldDraggableIndex,
                        newIndex,
                        newDraggableIndex,
                        hideGhostForTarget: _hideGhostForTarget,
                        unhideGhostForTarget: _unhideGhostForTarget,
                        cloneNowHidden: function () {
                            cloneHidden = !0
                        },
                        cloneNowShown: function () {
                            cloneHidden = !1
                        },
                        dispatchSortableEvent: function (name) {
                            _dispatchEvent({ sortable, name, originalEvent })
                        },
                    },
                    data,
                ),
            )
        }
    function _dispatchEvent(info) {
        dispatchEvent(
            _objectSpread22(
                {
                    putSortable,
                    cloneEl,
                    targetEl: dragEl,
                    rootEl,
                    oldIndex,
                    oldDraggableIndex,
                    newIndex,
                    newDraggableIndex,
                },
                info,
            ),
        )
    }
    var dragEl,
        parentEl,
        ghostEl,
        rootEl,
        nextEl,
        lastDownEl,
        cloneEl,
        cloneHidden,
        oldIndex,
        newIndex,
        oldDraggableIndex,
        newDraggableIndex,
        activeGroup,
        putSortable,
        awaitingDragStarted = !1,
        ignoreNextClick = !1,
        sortables = [],
        tapEvt,
        touchEvt,
        lastDx,
        lastDy,
        tapDistanceLeft,
        tapDistanceTop,
        moved,
        lastTarget,
        lastDirection,
        pastFirstInvertThresh = !1,
        isCircumstantialInvert = !1,
        targetMoveDistance,
        ghostRelativeParent,
        ghostRelativeParentInitialScroll = [],
        _silent = !1,
        savedInputChecked = [],
        documentExists = typeof document != 'undefined',
        PositionGhostAbsolutely = IOS,
        CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
        supportDraggable =
            documentExists &&
            !ChromeForAndroid &&
            !IOS &&
            'draggable' in document.createElement('div'),
        supportCssPointerEvents = (function () {
            if (!!documentExists) {
                if (IE11OrLess) return !1
                var el = document.createElement('x')
                return (
                    (el.style.cssText = 'pointer-events:auto'),
                    el.style.pointerEvents === 'auto'
                )
            }
        })(),
        _detectDirection = function (el, options) {
            var elCSS = css(el),
                elWidth =
                    parseInt(elCSS.width) -
                    parseInt(elCSS.paddingLeft) -
                    parseInt(elCSS.paddingRight) -
                    parseInt(elCSS.borderLeftWidth) -
                    parseInt(elCSS.borderRightWidth),
                child1 = getChild(el, 0, options),
                child2 = getChild(el, 1, options),
                firstChildCSS = child1 && css(child1),
                secondChildCSS = child2 && css(child2),
                firstChildWidth =
                    firstChildCSS &&
                    parseInt(firstChildCSS.marginLeft) +
                        parseInt(firstChildCSS.marginRight) +
                        getRect(child1).width,
                secondChildWidth =
                    secondChildCSS &&
                    parseInt(secondChildCSS.marginLeft) +
                        parseInt(secondChildCSS.marginRight) +
                        getRect(child2).width
            if (elCSS.display === 'flex')
                return elCSS.flexDirection === 'column' ||
                    elCSS.flexDirection === 'column-reverse'
                    ? 'vertical'
                    : 'horizontal'
            if (elCSS.display === 'grid')
                return elCSS.gridTemplateColumns.split(' ').length <= 1
                    ? 'vertical'
                    : 'horizontal'
            if (
                child1 &&
                firstChildCSS.float &&
                firstChildCSS.float !== 'none'
            ) {
                var touchingSideChild2 =
                    firstChildCSS.float === 'left' ? 'left' : 'right'
                return child2 &&
                    (secondChildCSS.clear === 'both' ||
                        secondChildCSS.clear === touchingSideChild2)
                    ? 'vertical'
                    : 'horizontal'
            }
            return child1 &&
                (firstChildCSS.display === 'block' ||
                    firstChildCSS.display === 'flex' ||
                    firstChildCSS.display === 'table' ||
                    firstChildCSS.display === 'grid' ||
                    (firstChildWidth >= elWidth &&
                        elCSS[CSSFloatProperty] === 'none') ||
                    (child2 &&
                        elCSS[CSSFloatProperty] === 'none' &&
                        firstChildWidth + secondChildWidth > elWidth))
                ? 'vertical'
                : 'horizontal'
        },
        _dragElInRowColumn = function (dragRect, targetRect, vertical) {
            var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
                dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
                dragElOppLength = vertical ? dragRect.width : dragRect.height,
                targetS1Opp = vertical ? targetRect.left : targetRect.top,
                targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
                targetOppLength = vertical
                    ? targetRect.width
                    : targetRect.height
            return (
                dragElS1Opp === targetS1Opp ||
                dragElS2Opp === targetS2Opp ||
                dragElS1Opp + dragElOppLength / 2 ===
                    targetS1Opp + targetOppLength / 2
            )
        },
        _detectNearestEmptySortable = function (x, y) {
            var ret
            return (
                sortables.some(function (sortable) {
                    var threshold =
                        sortable[expando].options.emptyInsertThreshold
                    if (!(!threshold || lastChild(sortable))) {
                        var rect = getRect(sortable),
                            insideHorizontally =
                                x >= rect.left - threshold &&
                                x <= rect.right + threshold,
                            insideVertically =
                                y >= rect.top - threshold &&
                                y <= rect.bottom + threshold
                        if (insideHorizontally && insideVertically)
                            return (ret = sortable)
                    }
                }),
                ret
            )
        },
        _prepareGroup = function (options) {
            function toFn(value, pull) {
                return function (to, from, dragEl2, evt) {
                    var sameGroup =
                        to.options.group.name &&
                        from.options.group.name &&
                        to.options.group.name === from.options.group.name
                    if (value == null && (pull || sameGroup)) return !0
                    if (value == null || value === !1) return !1
                    if (pull && value === 'clone') return value
                    if (typeof value == 'function')
                        return toFn(value(to, from, dragEl2, evt), pull)(
                            to,
                            from,
                            dragEl2,
                            evt,
                        )
                    var otherGroup = (pull ? to : from).options.group.name
                    return (
                        value === !0 ||
                        (typeof value == 'string' && value === otherGroup) ||
                        (value.join && value.indexOf(otherGroup) > -1)
                    )
                }
            }
            var group = {},
                originalGroup = options.group
            ;(!originalGroup || _typeof(originalGroup) != 'object') &&
                (originalGroup = { name: originalGroup }),
                (group.name = originalGroup.name),
                (group.checkPull = toFn(originalGroup.pull, !0)),
                (group.checkPut = toFn(originalGroup.put)),
                (group.revertClone = originalGroup.revertClone),
                (options.group = group)
        },
        _hideGhostForTarget = function () {
            !supportCssPointerEvents &&
                ghostEl &&
                css(ghostEl, 'display', 'none')
        },
        _unhideGhostForTarget = function () {
            !supportCssPointerEvents && ghostEl && css(ghostEl, 'display', '')
        }
    documentExists &&
        !ChromeForAndroid &&
        document.addEventListener(
            'click',
            function (evt) {
                if (ignoreNextClick)
                    return (
                        evt.preventDefault(),
                        evt.stopPropagation && evt.stopPropagation(),
                        evt.stopImmediatePropagation &&
                            evt.stopImmediatePropagation(),
                        (ignoreNextClick = !1),
                        !1
                    )
            },
            !0,
        )
    var nearestEmptyInsertDetectEvent = function (evt) {
            if (dragEl) {
                evt = evt.touches ? evt.touches[0] : evt
                var nearest = _detectNearestEmptySortable(
                    evt.clientX,
                    evt.clientY,
                )
                if (nearest) {
                    var event = {}
                    for (var i in evt)
                        evt.hasOwnProperty(i) && (event[i] = evt[i])
                    ;(event.target = event.rootEl = nearest),
                        (event.preventDefault = void 0),
                        (event.stopPropagation = void 0),
                        nearest[expando]._onDragOver(event)
                }
            }
        },
        _checkOutsideTargetEl = function (evt) {
            dragEl && dragEl.parentNode[expando]._isOutsideThisEl(evt.target)
        }
    function Sortable(el, options) {
        if (!(el && el.nodeType && el.nodeType === 1))
            throw 'Sortable: `el` must be an HTMLElement, not '.concat(
                {}.toString.call(el),
            )
        ;(this.el = el),
            (this.options = options = _extends({}, options)),
            (el[expando] = this)
        var defaults2 = {
            group: null,
            sort: !0,
            disabled: !1,
            store: null,
            handle: null,
            draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
            swapThreshold: 1,
            invertSwap: !1,
            invertedSwapThreshold: null,
            removeCloneOnHide: !0,
            direction: function () {
                return _detectDirection(el, this.options)
            },
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            ignore: 'a, img',
            filter: null,
            preventOnFilter: !0,
            animation: 0,
            easing: null,
            setData: function (dataTransfer, dragEl2) {
                dataTransfer.setData('Text', dragEl2.textContent)
            },
            dropBubble: !1,
            dragoverBubble: !1,
            dataIdAttr: 'data-id',
            delay: 0,
            delayOnTouchOnly: !1,
            touchStartThreshold:
                (Number.parseInt ? Number : window).parseInt(
                    window.devicePixelRatio,
                    10,
                ) || 1,
            forceFallback: !1,
            fallbackClass: 'sortable-fallback',
            fallbackOnBody: !1,
            fallbackTolerance: 0,
            fallbackOffset: { x: 0, y: 0 },
            supportPointer:
                Sortable.supportPointer !== !1 &&
                'PointerEvent' in window &&
                !Safari,
            emptyInsertThreshold: 5,
        }
        PluginManager.initializePlugins(this, el, defaults2)
        for (var name in defaults2)
            !(name in options) && (options[name] = defaults2[name])
        _prepareGroup(options)
        for (var fn in this)
            fn.charAt(0) === '_' &&
                typeof this[fn] == 'function' &&
                (this[fn] = this[fn].bind(this))
        ;(this.nativeDraggable = options.forceFallback ? !1 : supportDraggable),
            this.nativeDraggable && (this.options.touchStartThreshold = 1),
            options.supportPointer
                ? on(el, 'pointerdown', this._onTapStart)
                : (on(el, 'mousedown', this._onTapStart),
                  on(el, 'touchstart', this._onTapStart)),
            this.nativeDraggable &&
                (on(el, 'dragover', this), on(el, 'dragenter', this)),
            sortables.push(this.el),
            options.store &&
                options.store.get &&
                this.sort(options.store.get(this) || []),
            _extends(this, AnimationStateManager())
    }
    Sortable.prototype = {
        constructor: Sortable,
        _isOutsideThisEl: function (target) {
            !this.el.contains(target) &&
                target !== this.el &&
                (lastTarget = null)
        },
        _getDirection: function (evt, target) {
            return typeof this.options.direction == 'function'
                ? this.options.direction.call(this, evt, target, dragEl)
                : this.options.direction
        },
        _onTapStart: function (evt) {
            if (!!evt.cancelable) {
                var _this = this,
                    el = this.el,
                    options = this.options,
                    preventOnFilter = options.preventOnFilter,
                    type = evt.type,
                    touch =
                        (evt.touches && evt.touches[0]) ||
                        (evt.pointerType && evt.pointerType === 'touch' && evt),
                    target = (touch || evt).target,
                    originalTarget =
                        (evt.target.shadowRoot &&
                            ((evt.path && evt.path[0]) ||
                                (evt.composedPath && evt.composedPath()[0]))) ||
                        target,
                    filter = options.filter
                if (
                    (_saveInputCheckedState(el),
                    !dragEl &&
                        !(
                            (/mousedown|pointerdown/.test(type) &&
                                evt.button !== 0) ||
                            options.disabled
                        ) &&
                        !originalTarget.isContentEditable &&
                        !(
                            !this.nativeDraggable &&
                            Safari &&
                            target &&
                            target.tagName.toUpperCase() === 'SELECT'
                        ) &&
                        ((target = closest(target, options.draggable, el, !1)),
                        !(target && target.animated) && lastDownEl !== target))
                ) {
                    if (
                        ((oldIndex = index(target)),
                        (oldDraggableIndex = index(target, options.draggable)),
                        typeof filter == 'function')
                    ) {
                        if (filter.call(this, evt, target, this)) {
                            _dispatchEvent({
                                sortable: _this,
                                rootEl: originalTarget,
                                name: 'filter',
                                targetEl: target,
                                toEl: el,
                                fromEl: el,
                            }),
                                pluginEvent2('filter', _this, { evt }),
                                preventOnFilter &&
                                    evt.cancelable &&
                                    evt.preventDefault()
                            return
                        }
                    } else if (
                        filter &&
                        ((filter = filter.split(',').some(function (criteria) {
                            if (
                                ((criteria = closest(
                                    originalTarget,
                                    criteria.trim(),
                                    el,
                                    !1,
                                )),
                                criteria)
                            )
                                return (
                                    _dispatchEvent({
                                        sortable: _this,
                                        rootEl: criteria,
                                        name: 'filter',
                                        targetEl: target,
                                        fromEl: el,
                                        toEl: el,
                                    }),
                                    pluginEvent2('filter', _this, { evt }),
                                    !0
                                )
                        })),
                        filter)
                    ) {
                        preventOnFilter &&
                            evt.cancelable &&
                            evt.preventDefault()
                        return
                    }
                    ;(options.handle &&
                        !closest(originalTarget, options.handle, el, !1)) ||
                        this._prepareDragStart(evt, touch, target)
                }
            }
        },
        _prepareDragStart: function (evt, touch, target) {
            var _this = this,
                el = _this.el,
                options = _this.options,
                ownerDocument = el.ownerDocument,
                dragStartFn
            if (target && !dragEl && target.parentNode === el) {
                var dragRect = getRect(target)
                if (
                    ((rootEl = el),
                    (dragEl = target),
                    (parentEl = dragEl.parentNode),
                    (nextEl = dragEl.nextSibling),
                    (lastDownEl = target),
                    (activeGroup = options.group),
                    (Sortable.dragged = dragEl),
                    (tapEvt = {
                        target: dragEl,
                        clientX: (touch || evt).clientX,
                        clientY: (touch || evt).clientY,
                    }),
                    (tapDistanceLeft = tapEvt.clientX - dragRect.left),
                    (tapDistanceTop = tapEvt.clientY - dragRect.top),
                    (this._lastX = (touch || evt).clientX),
                    (this._lastY = (touch || evt).clientY),
                    (dragEl.style['will-change'] = 'all'),
                    (dragStartFn = function () {
                        if (
                            (pluginEvent2('delayEnded', _this, { evt }),
                            Sortable.eventCanceled)
                        ) {
                            _this._onDrop()
                            return
                        }
                        _this._disableDelayedDragEvents(),
                            !FireFox &&
                                _this.nativeDraggable &&
                                (dragEl.draggable = !0),
                            _this._triggerDragStart(evt, touch),
                            _dispatchEvent({
                                sortable: _this,
                                name: 'choose',
                                originalEvent: evt,
                            }),
                            toggleClass(dragEl, options.chosenClass, !0)
                    }),
                    options.ignore.split(',').forEach(function (criteria) {
                        find(dragEl, criteria.trim(), _disableDraggable)
                    }),
                    on(
                        ownerDocument,
                        'dragover',
                        nearestEmptyInsertDetectEvent,
                    ),
                    on(
                        ownerDocument,
                        'mousemove',
                        nearestEmptyInsertDetectEvent,
                    ),
                    on(
                        ownerDocument,
                        'touchmove',
                        nearestEmptyInsertDetectEvent,
                    ),
                    on(ownerDocument, 'mouseup', _this._onDrop),
                    on(ownerDocument, 'touchend', _this._onDrop),
                    on(ownerDocument, 'touchcancel', _this._onDrop),
                    FireFox &&
                        this.nativeDraggable &&
                        ((this.options.touchStartThreshold = 4),
                        (dragEl.draggable = !0)),
                    pluginEvent2('delayStart', this, { evt }),
                    options.delay &&
                        (!options.delayOnTouchOnly || touch) &&
                        (!this.nativeDraggable || !(Edge || IE11OrLess)))
                ) {
                    if (Sortable.eventCanceled) {
                        this._onDrop()
                        return
                    }
                    on(ownerDocument, 'mouseup', _this._disableDelayedDrag),
                        on(
                            ownerDocument,
                            'touchend',
                            _this._disableDelayedDrag,
                        ),
                        on(
                            ownerDocument,
                            'touchcancel',
                            _this._disableDelayedDrag,
                        ),
                        on(
                            ownerDocument,
                            'mousemove',
                            _this._delayedDragTouchMoveHandler,
                        ),
                        on(
                            ownerDocument,
                            'touchmove',
                            _this._delayedDragTouchMoveHandler,
                        ),
                        options.supportPointer &&
                            on(
                                ownerDocument,
                                'pointermove',
                                _this._delayedDragTouchMoveHandler,
                            ),
                        (_this._dragStartTimer = setTimeout(
                            dragStartFn,
                            options.delay,
                        ))
                } else dragStartFn()
            }
        },
        _delayedDragTouchMoveHandler: function (e) {
            var touch = e.touches ? e.touches[0] : e
            Math.max(
                Math.abs(touch.clientX - this._lastX),
                Math.abs(touch.clientY - this._lastY),
            ) >=
                Math.floor(
                    this.options.touchStartThreshold /
                        ((this.nativeDraggable && window.devicePixelRatio) ||
                            1),
                ) && this._disableDelayedDrag()
        },
        _disableDelayedDrag: function () {
            dragEl && _disableDraggable(dragEl),
                clearTimeout(this._dragStartTimer),
                this._disableDelayedDragEvents()
        },
        _disableDelayedDragEvents: function () {
            var ownerDocument = this.el.ownerDocument
            off(ownerDocument, 'mouseup', this._disableDelayedDrag),
                off(ownerDocument, 'touchend', this._disableDelayedDrag),
                off(ownerDocument, 'touchcancel', this._disableDelayedDrag),
                off(
                    ownerDocument,
                    'mousemove',
                    this._delayedDragTouchMoveHandler,
                ),
                off(
                    ownerDocument,
                    'touchmove',
                    this._delayedDragTouchMoveHandler,
                ),
                off(
                    ownerDocument,
                    'pointermove',
                    this._delayedDragTouchMoveHandler,
                )
        },
        _triggerDragStart: function (evt, touch) {
            ;(touch = touch || (evt.pointerType == 'touch' && evt)),
                !this.nativeDraggable || touch
                    ? this.options.supportPointer
                        ? on(document, 'pointermove', this._onTouchMove)
                        : touch
                        ? on(document, 'touchmove', this._onTouchMove)
                        : on(document, 'mousemove', this._onTouchMove)
                    : (on(dragEl, 'dragend', this),
                      on(rootEl, 'dragstart', this._onDragStart))
            try {
                document.selection
                    ? _nextTick(function () {
                          document.selection.empty()
                      })
                    : window.getSelection().removeAllRanges()
            } catch (err) {}
        },
        _dragStarted: function (fallback, evt) {
            if (((awaitingDragStarted = !1), rootEl && dragEl)) {
                pluginEvent2('dragStarted', this, { evt }),
                    this.nativeDraggable &&
                        on(document, 'dragover', _checkOutsideTargetEl)
                var options = this.options
                !fallback && toggleClass(dragEl, options.dragClass, !1),
                    toggleClass(dragEl, options.ghostClass, !0),
                    (Sortable.active = this),
                    fallback && this._appendGhost(),
                    _dispatchEvent({
                        sortable: this,
                        name: 'start',
                        originalEvent: evt,
                    })
            } else this._nulling()
        },
        _emulateDragOver: function () {
            if (touchEvt) {
                ;(this._lastX = touchEvt.clientX),
                    (this._lastY = touchEvt.clientY),
                    _hideGhostForTarget()
                for (
                    var target = document.elementFromPoint(
                            touchEvt.clientX,
                            touchEvt.clientY,
                        ),
                        parent = target;
                    target &&
                    target.shadowRoot &&
                    ((target = target.shadowRoot.elementFromPoint(
                        touchEvt.clientX,
                        touchEvt.clientY,
                    )),
                    target !== parent);

                )
                    parent = target
                if (
                    (dragEl.parentNode[expando]._isOutsideThisEl(target),
                    parent)
                )
                    do {
                        if (parent[expando]) {
                            var inserted = void 0
                            if (
                                ((inserted = parent[expando]._onDragOver({
                                    clientX: touchEvt.clientX,
                                    clientY: touchEvt.clientY,
                                    target,
                                    rootEl: parent,
                                })),
                                inserted && !this.options.dragoverBubble)
                            )
                                break
                        }
                        target = parent
                    } while ((parent = parent.parentNode))
                _unhideGhostForTarget()
            }
        },
        _onTouchMove: function (evt) {
            if (tapEvt) {
                var options = this.options,
                    fallbackTolerance = options.fallbackTolerance,
                    fallbackOffset = options.fallbackOffset,
                    touch = evt.touches ? evt.touches[0] : evt,
                    ghostMatrix = ghostEl && matrix(ghostEl, !0),
                    scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
                    scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
                    relativeScrollOffset =
                        PositionGhostAbsolutely &&
                        ghostRelativeParent &&
                        getRelativeScrollOffset(ghostRelativeParent),
                    dx =
                        (touch.clientX - tapEvt.clientX + fallbackOffset.x) /
                            (scaleX || 1) +
                        (relativeScrollOffset
                            ? relativeScrollOffset[0] -
                              ghostRelativeParentInitialScroll[0]
                            : 0) /
                            (scaleX || 1),
                    dy =
                        (touch.clientY - tapEvt.clientY + fallbackOffset.y) /
                            (scaleY || 1) +
                        (relativeScrollOffset
                            ? relativeScrollOffset[1] -
                              ghostRelativeParentInitialScroll[1]
                            : 0) /
                            (scaleY || 1)
                if (!Sortable.active && !awaitingDragStarted) {
                    if (
                        fallbackTolerance &&
                        Math.max(
                            Math.abs(touch.clientX - this._lastX),
                            Math.abs(touch.clientY - this._lastY),
                        ) < fallbackTolerance
                    )
                        return
                    this._onDragStart(evt, !0)
                }
                if (ghostEl) {
                    ghostMatrix
                        ? ((ghostMatrix.e += dx - (lastDx || 0)),
                          (ghostMatrix.f += dy - (lastDy || 0)))
                        : (ghostMatrix = {
                              a: 1,
                              b: 0,
                              c: 0,
                              d: 1,
                              e: dx,
                              f: dy,
                          })
                    var cssMatrix = 'matrix('
                        .concat(ghostMatrix.a, ',')
                        .concat(ghostMatrix.b, ',')
                        .concat(ghostMatrix.c, ',')
                        .concat(ghostMatrix.d, ',')
                        .concat(ghostMatrix.e, ',')
                        .concat(ghostMatrix.f, ')')
                    css(ghostEl, 'webkitTransform', cssMatrix),
                        css(ghostEl, 'mozTransform', cssMatrix),
                        css(ghostEl, 'msTransform', cssMatrix),
                        css(ghostEl, 'transform', cssMatrix),
                        (lastDx = dx),
                        (lastDy = dy),
                        (touchEvt = touch)
                }
                evt.cancelable && evt.preventDefault()
            }
        },
        _appendGhost: function () {
            if (!ghostEl) {
                var container = this.options.fallbackOnBody
                        ? document.body
                        : rootEl,
                    rect = getRect(
                        dragEl,
                        !0,
                        PositionGhostAbsolutely,
                        !0,
                        container,
                    ),
                    options = this.options
                if (PositionGhostAbsolutely) {
                    for (
                        ghostRelativeParent = container;
                        css(ghostRelativeParent, 'position') === 'static' &&
                        css(ghostRelativeParent, 'transform') === 'none' &&
                        ghostRelativeParent !== document;

                    )
                        ghostRelativeParent = ghostRelativeParent.parentNode
                    ghostRelativeParent !== document.body &&
                    ghostRelativeParent !== document.documentElement
                        ? (ghostRelativeParent === document &&
                              (ghostRelativeParent =
                                  getWindowScrollingElement()),
                          (rect.top += ghostRelativeParent.scrollTop),
                          (rect.left += ghostRelativeParent.scrollLeft))
                        : (ghostRelativeParent = getWindowScrollingElement()),
                        (ghostRelativeParentInitialScroll =
                            getRelativeScrollOffset(ghostRelativeParent))
                }
                ;(ghostEl = dragEl.cloneNode(!0)),
                    toggleClass(ghostEl, options.ghostClass, !1),
                    toggleClass(ghostEl, options.fallbackClass, !0),
                    toggleClass(ghostEl, options.dragClass, !0),
                    css(ghostEl, 'transition', ''),
                    css(ghostEl, 'transform', ''),
                    css(ghostEl, 'box-sizing', 'border-box'),
                    css(ghostEl, 'margin', 0),
                    css(ghostEl, 'top', rect.top),
                    css(ghostEl, 'left', rect.left),
                    css(ghostEl, 'width', rect.width),
                    css(ghostEl, 'height', rect.height),
                    css(ghostEl, 'opacity', '0.8'),
                    css(
                        ghostEl,
                        'position',
                        PositionGhostAbsolutely ? 'absolute' : 'fixed',
                    ),
                    css(ghostEl, 'zIndex', '100000'),
                    css(ghostEl, 'pointerEvents', 'none'),
                    (Sortable.ghost = ghostEl),
                    container.appendChild(ghostEl),
                    css(
                        ghostEl,
                        'transform-origin',
                        (tapDistanceLeft / parseInt(ghostEl.style.width)) *
                            100 +
                            '% ' +
                            (tapDistanceTop / parseInt(ghostEl.style.height)) *
                                100 +
                            '%',
                    )
            }
        },
        _onDragStart: function (evt, fallback) {
            var _this = this,
                dataTransfer = evt.dataTransfer,
                options = _this.options
            if (
                (pluginEvent2('dragStart', this, { evt }),
                Sortable.eventCanceled)
            ) {
                this._onDrop()
                return
            }
            pluginEvent2('setupClone', this),
                Sortable.eventCanceled ||
                    ((cloneEl = clone(dragEl)),
                    cloneEl.removeAttribute('id'),
                    (cloneEl.draggable = !1),
                    (cloneEl.style['will-change'] = ''),
                    this._hideClone(),
                    toggleClass(cloneEl, this.options.chosenClass, !1),
                    (Sortable.clone = cloneEl)),
                (_this.cloneId = _nextTick(function () {
                    pluginEvent2('clone', _this),
                        !Sortable.eventCanceled &&
                            (_this.options.removeCloneOnHide ||
                                rootEl.insertBefore(cloneEl, dragEl),
                            _this._hideClone(),
                            _dispatchEvent({ sortable: _this, name: 'clone' }))
                })),
                !fallback && toggleClass(dragEl, options.dragClass, !0),
                fallback
                    ? ((ignoreNextClick = !0),
                      (_this._loopId = setInterval(_this._emulateDragOver, 50)))
                    : (off(document, 'mouseup', _this._onDrop),
                      off(document, 'touchend', _this._onDrop),
                      off(document, 'touchcancel', _this._onDrop),
                      dataTransfer &&
                          ((dataTransfer.effectAllowed = 'move'),
                          options.setData &&
                              options.setData.call(
                                  _this,
                                  dataTransfer,
                                  dragEl,
                              )),
                      on(document, 'drop', _this),
                      css(dragEl, 'transform', 'translateZ(0)')),
                (awaitingDragStarted = !0),
                (_this._dragStartId = _nextTick(
                    _this._dragStarted.bind(_this, fallback, evt),
                )),
                on(document, 'selectstart', _this),
                (moved = !0),
                Safari && css(document.body, 'user-select', 'none')
        },
        _onDragOver: function (evt) {
            var el = this.el,
                target = evt.target,
                dragRect,
                targetRect,
                revert,
                options = this.options,
                group = options.group,
                activeSortable = Sortable.active,
                isOwner = activeGroup === group,
                canSort = options.sort,
                fromSortable = putSortable || activeSortable,
                vertical,
                _this = this,
                completedFired = !1
            if (_silent) return
            function dragOverEvent(name, extra) {
                pluginEvent2(
                    name,
                    _this,
                    _objectSpread22(
                        {
                            evt,
                            isOwner,
                            axis: vertical ? 'vertical' : 'horizontal',
                            revert,
                            dragRect,
                            targetRect,
                            canSort,
                            fromSortable,
                            target,
                            completed,
                            onMove: function (target2, after2) {
                                return _onMove(
                                    rootEl,
                                    el,
                                    dragEl,
                                    dragRect,
                                    target2,
                                    getRect(target2),
                                    evt,
                                    after2,
                                )
                            },
                            changed,
                        },
                        extra,
                    ),
                )
            }
            function capture() {
                dragOverEvent('dragOverAnimationCapture'),
                    _this.captureAnimationState(),
                    _this !== fromSortable &&
                        fromSortable.captureAnimationState()
            }
            function completed(insertion) {
                return (
                    dragOverEvent('dragOverCompleted', { insertion }),
                    insertion &&
                        (isOwner
                            ? activeSortable._hideClone()
                            : activeSortable._showClone(_this),
                        _this !== fromSortable &&
                            (toggleClass(
                                dragEl,
                                putSortable
                                    ? putSortable.options.ghostClass
                                    : activeSortable.options.ghostClass,
                                !1,
                            ),
                            toggleClass(dragEl, options.ghostClass, !0)),
                        putSortable !== _this && _this !== Sortable.active
                            ? (putSortable = _this)
                            : _this === Sortable.active &&
                              putSortable &&
                              (putSortable = null),
                        fromSortable === _this &&
                            (_this._ignoreWhileAnimating = target),
                        _this.animateAll(function () {
                            dragOverEvent('dragOverAnimationComplete'),
                                (_this._ignoreWhileAnimating = null)
                        }),
                        _this !== fromSortable &&
                            (fromSortable.animateAll(),
                            (fromSortable._ignoreWhileAnimating = null))),
                    ((target === dragEl && !dragEl.animated) ||
                        (target === el && !target.animated)) &&
                        (lastTarget = null),
                    !options.dragoverBubble &&
                        !evt.rootEl &&
                        target !== document &&
                        (dragEl.parentNode[expando]._isOutsideThisEl(
                            evt.target,
                        ),
                        !insertion && nearestEmptyInsertDetectEvent(evt)),
                    !options.dragoverBubble &&
                        evt.stopPropagation &&
                        evt.stopPropagation(),
                    (completedFired = !0)
                )
            }
            function changed() {
                ;(newIndex = index(dragEl)),
                    (newDraggableIndex = index(dragEl, options.draggable)),
                    _dispatchEvent({
                        sortable: _this,
                        name: 'change',
                        toEl: el,
                        newIndex,
                        newDraggableIndex,
                        originalEvent: evt,
                    })
            }
            if (
                (evt.preventDefault !== void 0 &&
                    evt.cancelable &&
                    evt.preventDefault(),
                (target = closest(target, options.draggable, el, !0)),
                dragOverEvent('dragOver'),
                Sortable.eventCanceled)
            )
                return completedFired
            if (
                dragEl.contains(evt.target) ||
                (target.animated && target.animatingX && target.animatingY) ||
                _this._ignoreWhileAnimating === target
            )
                return completed(!1)
            if (
                ((ignoreNextClick = !1),
                activeSortable &&
                    !options.disabled &&
                    (isOwner
                        ? canSort || (revert = parentEl !== rootEl)
                        : putSortable === this ||
                          ((this.lastPutMode = activeGroup.checkPull(
                              this,
                              activeSortable,
                              dragEl,
                              evt,
                          )) &&
                              group.checkPut(
                                  this,
                                  activeSortable,
                                  dragEl,
                                  evt,
                              ))))
            ) {
                if (
                    ((vertical =
                        this._getDirection(evt, target) === 'vertical'),
                    (dragRect = getRect(dragEl)),
                    dragOverEvent('dragOverValid'),
                    Sortable.eventCanceled)
                )
                    return completedFired
                if (revert)
                    return (
                        (parentEl = rootEl),
                        capture(),
                        this._hideClone(),
                        dragOverEvent('revert'),
                        Sortable.eventCanceled ||
                            (nextEl
                                ? rootEl.insertBefore(dragEl, nextEl)
                                : rootEl.appendChild(dragEl)),
                        completed(!0)
                    )
                var elLastChild = lastChild(el, options.draggable)
                if (
                    !elLastChild ||
                    (_ghostIsLast(evt, vertical, this) && !elLastChild.animated)
                ) {
                    if (elLastChild === dragEl) return completed(!1)
                    if (
                        (elLastChild &&
                            el === evt.target &&
                            (target = elLastChild),
                        target && (targetRect = getRect(target)),
                        _onMove(
                            rootEl,
                            el,
                            dragEl,
                            dragRect,
                            target,
                            targetRect,
                            evt,
                            !!target,
                        ) !== !1)
                    )
                        return (
                            capture(),
                            elLastChild && elLastChild.nextSibling
                                ? el.insertBefore(
                                      dragEl,
                                      elLastChild.nextSibling,
                                  )
                                : el.appendChild(dragEl),
                            (parentEl = el),
                            changed(),
                            completed(!0)
                        )
                } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
                    var firstChild = getChild(el, 0, options, !0)
                    if (firstChild === dragEl) return completed(!1)
                    if (
                        ((target = firstChild),
                        (targetRect = getRect(target)),
                        _onMove(
                            rootEl,
                            el,
                            dragEl,
                            dragRect,
                            target,
                            targetRect,
                            evt,
                            !1,
                        ) !== !1)
                    )
                        return (
                            capture(),
                            el.insertBefore(dragEl, firstChild),
                            (parentEl = el),
                            changed(),
                            completed(!0)
                        )
                } else if (target.parentNode === el) {
                    targetRect = getRect(target)
                    var direction = 0,
                        targetBeforeFirstSwap,
                        differentLevel = dragEl.parentNode !== el,
                        differentRowCol = !_dragElInRowColumn(
                            (dragEl.animated && dragEl.toRect) || dragRect,
                            (target.animated && target.toRect) || targetRect,
                            vertical,
                        ),
                        side1 = vertical ? 'top' : 'left',
                        scrolledPastTop =
                            isScrolledPast(target, 'top', 'top') ||
                            isScrolledPast(dragEl, 'top', 'top'),
                        scrollBefore = scrolledPastTop
                            ? scrolledPastTop.scrollTop
                            : void 0
                    lastTarget !== target &&
                        ((targetBeforeFirstSwap = targetRect[side1]),
                        (pastFirstInvertThresh = !1),
                        (isCircumstantialInvert =
                            (!differentRowCol && options.invertSwap) ||
                            differentLevel)),
                        (direction = _getSwapDirection(
                            evt,
                            target,
                            targetRect,
                            vertical,
                            differentRowCol ? 1 : options.swapThreshold,
                            options.invertedSwapThreshold == null
                                ? options.swapThreshold
                                : options.invertedSwapThreshold,
                            isCircumstantialInvert,
                            lastTarget === target,
                        ))
                    var sibling
                    if (direction !== 0) {
                        var dragIndex = index(dragEl)
                        do
                            (dragIndex -= direction),
                                (sibling = parentEl.children[dragIndex])
                        while (
                            sibling &&
                            (css(sibling, 'display') === 'none' ||
                                sibling === ghostEl)
                        )
                    }
                    if (direction === 0 || sibling === target)
                        return completed(!1)
                    ;(lastTarget = target), (lastDirection = direction)
                    var nextSibling = target.nextElementSibling,
                        after = !1
                    after = direction === 1
                    var moveVector = _onMove(
                        rootEl,
                        el,
                        dragEl,
                        dragRect,
                        target,
                        targetRect,
                        evt,
                        after,
                    )
                    if (moveVector !== !1)
                        return (
                            (moveVector === 1 || moveVector === -1) &&
                                (after = moveVector === 1),
                            (_silent = !0),
                            setTimeout(_unsilent, 30),
                            capture(),
                            after && !nextSibling
                                ? el.appendChild(dragEl)
                                : target.parentNode.insertBefore(
                                      dragEl,
                                      after ? nextSibling : target,
                                  ),
                            scrolledPastTop &&
                                scrollBy(
                                    scrolledPastTop,
                                    0,
                                    scrollBefore - scrolledPastTop.scrollTop,
                                ),
                            (parentEl = dragEl.parentNode),
                            targetBeforeFirstSwap !== void 0 &&
                                !isCircumstantialInvert &&
                                (targetMoveDistance = Math.abs(
                                    targetBeforeFirstSwap -
                                        getRect(target)[side1],
                                )),
                            changed(),
                            completed(!0)
                        )
                }
                if (el.contains(dragEl)) return completed(!1)
            }
            return !1
        },
        _ignoreWhileAnimating: null,
        _offMoveEvents: function () {
            off(document, 'mousemove', this._onTouchMove),
                off(document, 'touchmove', this._onTouchMove),
                off(document, 'pointermove', this._onTouchMove),
                off(document, 'dragover', nearestEmptyInsertDetectEvent),
                off(document, 'mousemove', nearestEmptyInsertDetectEvent),
                off(document, 'touchmove', nearestEmptyInsertDetectEvent)
        },
        _offUpEvents: function () {
            var ownerDocument = this.el.ownerDocument
            off(ownerDocument, 'mouseup', this._onDrop),
                off(ownerDocument, 'touchend', this._onDrop),
                off(ownerDocument, 'pointerup', this._onDrop),
                off(ownerDocument, 'touchcancel', this._onDrop),
                off(document, 'selectstart', this)
        },
        _onDrop: function (evt) {
            var el = this.el,
                options = this.options
            if (
                ((newIndex = index(dragEl)),
                (newDraggableIndex = index(dragEl, options.draggable)),
                pluginEvent2('drop', this, { evt }),
                (parentEl = dragEl && dragEl.parentNode),
                (newIndex = index(dragEl)),
                (newDraggableIndex = index(dragEl, options.draggable)),
                Sortable.eventCanceled)
            ) {
                this._nulling()
                return
            }
            ;(awaitingDragStarted = !1),
                (isCircumstantialInvert = !1),
                (pastFirstInvertThresh = !1),
                clearInterval(this._loopId),
                clearTimeout(this._dragStartTimer),
                _cancelNextTick(this.cloneId),
                _cancelNextTick(this._dragStartId),
                this.nativeDraggable &&
                    (off(document, 'drop', this),
                    off(el, 'dragstart', this._onDragStart)),
                this._offMoveEvents(),
                this._offUpEvents(),
                Safari && css(document.body, 'user-select', ''),
                css(dragEl, 'transform', ''),
                evt &&
                    (moved &&
                        (evt.cancelable && evt.preventDefault(),
                        !options.dropBubble && evt.stopPropagation()),
                    ghostEl &&
                        ghostEl.parentNode &&
                        ghostEl.parentNode.removeChild(ghostEl),
                    (rootEl === parentEl ||
                        (putSortable && putSortable.lastPutMode !== 'clone')) &&
                        cloneEl &&
                        cloneEl.parentNode &&
                        cloneEl.parentNode.removeChild(cloneEl),
                    dragEl &&
                        (this.nativeDraggable && off(dragEl, 'dragend', this),
                        _disableDraggable(dragEl),
                        (dragEl.style['will-change'] = ''),
                        moved &&
                            !awaitingDragStarted &&
                            toggleClass(
                                dragEl,
                                putSortable
                                    ? putSortable.options.ghostClass
                                    : this.options.ghostClass,
                                !1,
                            ),
                        toggleClass(dragEl, this.options.chosenClass, !1),
                        _dispatchEvent({
                            sortable: this,
                            name: 'unchoose',
                            toEl: parentEl,
                            newIndex: null,
                            newDraggableIndex: null,
                            originalEvent: evt,
                        }),
                        rootEl !== parentEl
                            ? (newIndex >= 0 &&
                                  (_dispatchEvent({
                                      rootEl: parentEl,
                                      name: 'add',
                                      toEl: parentEl,
                                      fromEl: rootEl,
                                      originalEvent: evt,
                                  }),
                                  _dispatchEvent({
                                      sortable: this,
                                      name: 'remove',
                                      toEl: parentEl,
                                      originalEvent: evt,
                                  }),
                                  _dispatchEvent({
                                      rootEl: parentEl,
                                      name: 'sort',
                                      toEl: parentEl,
                                      fromEl: rootEl,
                                      originalEvent: evt,
                                  }),
                                  _dispatchEvent({
                                      sortable: this,
                                      name: 'sort',
                                      toEl: parentEl,
                                      originalEvent: evt,
                                  })),
                              putSortable && putSortable.save())
                            : newIndex !== oldIndex &&
                              newIndex >= 0 &&
                              (_dispatchEvent({
                                  sortable: this,
                                  name: 'update',
                                  toEl: parentEl,
                                  originalEvent: evt,
                              }),
                              _dispatchEvent({
                                  sortable: this,
                                  name: 'sort',
                                  toEl: parentEl,
                                  originalEvent: evt,
                              })),
                        Sortable.active &&
                            ((newIndex == null || newIndex === -1) &&
                                ((newIndex = oldIndex),
                                (newDraggableIndex = oldDraggableIndex)),
                            _dispatchEvent({
                                sortable: this,
                                name: 'end',
                                toEl: parentEl,
                                originalEvent: evt,
                            }),
                            this.save()))),
                this._nulling()
        },
        _nulling: function () {
            pluginEvent2('nulling', this),
                (rootEl =
                    dragEl =
                    parentEl =
                    ghostEl =
                    nextEl =
                    cloneEl =
                    lastDownEl =
                    cloneHidden =
                    tapEvt =
                    touchEvt =
                    moved =
                    newIndex =
                    newDraggableIndex =
                    oldIndex =
                    oldDraggableIndex =
                    lastTarget =
                    lastDirection =
                    putSortable =
                    activeGroup =
                    Sortable.dragged =
                    Sortable.ghost =
                    Sortable.clone =
                    Sortable.active =
                        null),
                savedInputChecked.forEach(function (el) {
                    el.checked = !0
                }),
                (savedInputChecked.length = lastDx = lastDy = 0)
        },
        handleEvent: function (evt) {
            switch (evt.type) {
                case 'drop':
                case 'dragend':
                    this._onDrop(evt)
                    break
                case 'dragenter':
                case 'dragover':
                    dragEl && (this._onDragOver(evt), _globalDragOver(evt))
                    break
                case 'selectstart':
                    evt.preventDefault()
                    break
            }
        },
        toArray: function () {
            for (
                var order = [],
                    el,
                    children = this.el.children,
                    i = 0,
                    n = children.length,
                    options = this.options;
                i < n;
                i++
            )
                (el = children[i]),
                    closest(el, options.draggable, this.el, !1) &&
                        order.push(
                            el.getAttribute(options.dataIdAttr) ||
                                _generateId(el),
                        )
            return order
        },
        sort: function (order, useAnimation) {
            var items = {},
                rootEl2 = this.el
            this.toArray().forEach(function (id, i) {
                var el = rootEl2.children[i]
                closest(el, this.options.draggable, rootEl2, !1) &&
                    (items[id] = el)
            }, this),
                useAnimation && this.captureAnimationState(),
                order.forEach(function (id) {
                    items[id] &&
                        (rootEl2.removeChild(items[id]),
                        rootEl2.appendChild(items[id]))
                }),
                useAnimation && this.animateAll()
        },
        save: function () {
            var store = this.options.store
            store && store.set && store.set(this)
        },
        closest: function (el, selector) {
            return closest(el, selector || this.options.draggable, this.el, !1)
        },
        option: function (name, value) {
            var options = this.options
            if (value === void 0) return options[name]
            var modifiedValue = PluginManager.modifyOption(this, name, value)
            typeof modifiedValue != 'undefined'
                ? (options[name] = modifiedValue)
                : (options[name] = value),
                name === 'group' && _prepareGroup(options)
        },
        destroy: function () {
            pluginEvent2('destroy', this)
            var el = this.el
            ;(el[expando] = null),
                off(el, 'mousedown', this._onTapStart),
                off(el, 'touchstart', this._onTapStart),
                off(el, 'pointerdown', this._onTapStart),
                this.nativeDraggable &&
                    (off(el, 'dragover', this), off(el, 'dragenter', this)),
                Array.prototype.forEach.call(
                    el.querySelectorAll('[draggable]'),
                    function (el2) {
                        el2.removeAttribute('draggable')
                    },
                ),
                this._onDrop(),
                this._disableDelayedDragEvents(),
                sortables.splice(sortables.indexOf(this.el), 1),
                (this.el = el = null)
        },
        _hideClone: function () {
            if (!cloneHidden) {
                if ((pluginEvent2('hideClone', this), Sortable.eventCanceled))
                    return
                css(cloneEl, 'display', 'none'),
                    this.options.removeCloneOnHide &&
                        cloneEl.parentNode &&
                        cloneEl.parentNode.removeChild(cloneEl),
                    (cloneHidden = !0)
            }
        },
        _showClone: function (putSortable2) {
            if (putSortable2.lastPutMode !== 'clone') {
                this._hideClone()
                return
            }
            if (cloneHidden) {
                if ((pluginEvent2('showClone', this), Sortable.eventCanceled))
                    return
                dragEl.parentNode == rootEl && !this.options.group.revertClone
                    ? rootEl.insertBefore(cloneEl, dragEl)
                    : nextEl
                    ? rootEl.insertBefore(cloneEl, nextEl)
                    : rootEl.appendChild(cloneEl),
                    this.options.group.revertClone &&
                        this.animate(dragEl, cloneEl),
                    css(cloneEl, 'display', ''),
                    (cloneHidden = !1)
            }
        },
    }
    function _globalDragOver(evt) {
        evt.dataTransfer && (evt.dataTransfer.dropEffect = 'move'),
            evt.cancelable && evt.preventDefault()
    }
    function _onMove(
        fromEl,
        toEl,
        dragEl2,
        dragRect,
        targetEl,
        targetRect,
        originalEvent,
        willInsertAfter,
    ) {
        var evt,
            sortable = fromEl[expando],
            onMoveFn = sortable.options.onMove,
            retVal
        return (
            window.CustomEvent && !IE11OrLess && !Edge
                ? (evt = new CustomEvent('move', {
                      bubbles: !0,
                      cancelable: !0,
                  }))
                : ((evt = document.createEvent('Event')),
                  evt.initEvent('move', !0, !0)),
            (evt.to = toEl),
            (evt.from = fromEl),
            (evt.dragged = dragEl2),
            (evt.draggedRect = dragRect),
            (evt.related = targetEl || toEl),
            (evt.relatedRect = targetRect || getRect(toEl)),
            (evt.willInsertAfter = willInsertAfter),
            (evt.originalEvent = originalEvent),
            fromEl.dispatchEvent(evt),
            onMoveFn && (retVal = onMoveFn.call(sortable, evt, originalEvent)),
            retVal
        )
    }
    function _disableDraggable(el) {
        el.draggable = !1
    }
    function _unsilent() {
        _silent = !1
    }
    function _ghostIsFirst(evt, vertical, sortable) {
        var rect = getRect(getChild(sortable.el, 0, sortable.options, !0)),
            spacer = 10
        return vertical
            ? evt.clientX < rect.left - spacer ||
                  (evt.clientY < rect.top && evt.clientX < rect.right)
            : evt.clientY < rect.top - spacer ||
                  (evt.clientY < rect.bottom && evt.clientX < rect.left)
    }
    function _ghostIsLast(evt, vertical, sortable) {
        var rect = getRect(lastChild(sortable.el, sortable.options.draggable)),
            spacer = 10
        return vertical
            ? evt.clientX > rect.right + spacer ||
                  (evt.clientX <= rect.right &&
                      evt.clientY > rect.bottom &&
                      evt.clientX >= rect.left)
            : (evt.clientX > rect.right && evt.clientY > rect.top) ||
                  (evt.clientX <= rect.right &&
                      evt.clientY > rect.bottom + spacer)
    }
    function _getSwapDirection(
        evt,
        target,
        targetRect,
        vertical,
        swapThreshold,
        invertedSwapThreshold,
        invertSwap,
        isLastTarget,
    ) {
        var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
            targetLength = vertical ? targetRect.height : targetRect.width,
            targetS1 = vertical ? targetRect.top : targetRect.left,
            targetS2 = vertical ? targetRect.bottom : targetRect.right,
            invert = !1
        if (!invertSwap) {
            if (
                isLastTarget &&
                targetMoveDistance < targetLength * swapThreshold
            ) {
                if (
                    (!pastFirstInvertThresh &&
                        (lastDirection === 1
                            ? mouseOnAxis >
                              targetS1 +
                                  (targetLength * invertedSwapThreshold) / 2
                            : mouseOnAxis <
                              targetS2 -
                                  (targetLength * invertedSwapThreshold) / 2) &&
                        (pastFirstInvertThresh = !0),
                    pastFirstInvertThresh)
                )
                    invert = !0
                else if (
                    lastDirection === 1
                        ? mouseOnAxis < targetS1 + targetMoveDistance
                        : mouseOnAxis > targetS2 - targetMoveDistance
                )
                    return -lastDirection
            } else if (
                mouseOnAxis >
                    targetS1 + (targetLength * (1 - swapThreshold)) / 2 &&
                mouseOnAxis <
                    targetS2 - (targetLength * (1 - swapThreshold)) / 2
            )
                return _getInsertDirection(target)
        }
        return (
            (invert = invert || invertSwap),
            invert &&
            (mouseOnAxis <
                targetS1 + (targetLength * invertedSwapThreshold) / 2 ||
                mouseOnAxis >
                    targetS2 - (targetLength * invertedSwapThreshold) / 2)
                ? mouseOnAxis > targetS1 + targetLength / 2
                    ? 1
                    : -1
                : 0
        )
    }
    function _getInsertDirection(target) {
        return index(dragEl) < index(target) ? 1 : -1
    }
    function _generateId(el) {
        for (
            var str =
                    el.tagName +
                    el.className +
                    el.src +
                    el.href +
                    el.textContent,
                i = str.length,
                sum = 0;
            i--;

        )
            sum += str.charCodeAt(i)
        return sum.toString(36)
    }
    function _saveInputCheckedState(root) {
        savedInputChecked.length = 0
        for (
            var inputs = root.getElementsByTagName('input'),
                idx = inputs.length;
            idx--;

        ) {
            var el = inputs[idx]
            el.checked && savedInputChecked.push(el)
        }
    }
    function _nextTick(fn) {
        return setTimeout(fn, 0)
    }
    function _cancelNextTick(id) {
        return clearTimeout(id)
    }
    documentExists &&
        on(document, 'touchmove', function (evt) {
            ;(Sortable.active || awaitingDragStarted) &&
                evt.cancelable &&
                evt.preventDefault()
        })
    Sortable.utils = {
        on,
        off,
        css,
        find,
        is: function (el, selector) {
            return !!closest(el, selector, el, !1)
        },
        extend,
        throttle,
        closest,
        toggleClass,
        clone,
        index,
        nextTick: _nextTick,
        cancelNextTick: _cancelNextTick,
        detectDirection: _detectDirection,
        getChild,
    }
    Sortable.get = function (element) {
        return element[expando]
    }
    Sortable.mount = function () {
        for (
            var _len = arguments.length, plugins2 = new Array(_len), _key = 0;
            _key < _len;
            _key++
        )
            plugins2[_key] = arguments[_key]
        plugins2[0].constructor === Array && (plugins2 = plugins2[0]),
            plugins2.forEach(function (plugin) {
                if (!plugin.prototype || !plugin.prototype.constructor)
                    throw 'Sortable: Mounted plugin must be a constructor function, not '.concat(
                        {}.toString.call(plugin),
                    )
                plugin.utils &&
                    (Sortable.utils = _objectSpread22(
                        _objectSpread22({}, Sortable.utils),
                        plugin.utils,
                    )),
                    PluginManager.mount(plugin)
            })
    }
    Sortable.create = function (el, options) {
        return new Sortable(el, options)
    }
    Sortable.version = version
    var autoScrolls = [],
        scrollEl,
        scrollRootEl,
        scrolling = !1,
        lastAutoScrollX,
        lastAutoScrollY,
        touchEvt$1,
        pointerElemChangedInterval
    function AutoScrollPlugin() {
        function AutoScroll() {
            this.defaults = {
                scroll: !0,
                forceAutoScrollFallback: !1,
                scrollSensitivity: 30,
                scrollSpeed: 10,
                bubbleScroll: !0,
            }
            for (var fn in this)
                fn.charAt(0) === '_' &&
                    typeof this[fn] == 'function' &&
                    (this[fn] = this[fn].bind(this))
        }
        return (
            (AutoScroll.prototype = {
                dragStarted: function (_ref) {
                    var originalEvent = _ref.originalEvent
                    this.sortable.nativeDraggable
                        ? on(document, 'dragover', this._handleAutoScroll)
                        : this.options.supportPointer
                        ? on(
                              document,
                              'pointermove',
                              this._handleFallbackAutoScroll,
                          )
                        : originalEvent.touches
                        ? on(
                              document,
                              'touchmove',
                              this._handleFallbackAutoScroll,
                          )
                        : on(
                              document,
                              'mousemove',
                              this._handleFallbackAutoScroll,
                          )
                },
                dragOverCompleted: function (_ref2) {
                    var originalEvent = _ref2.originalEvent
                    !this.options.dragOverBubble &&
                        !originalEvent.rootEl &&
                        this._handleAutoScroll(originalEvent)
                },
                drop: function () {
                    this.sortable.nativeDraggable
                        ? off(document, 'dragover', this._handleAutoScroll)
                        : (off(
                              document,
                              'pointermove',
                              this._handleFallbackAutoScroll,
                          ),
                          off(
                              document,
                              'touchmove',
                              this._handleFallbackAutoScroll,
                          ),
                          off(
                              document,
                              'mousemove',
                              this._handleFallbackAutoScroll,
                          )),
                        clearPointerElemChangedInterval(),
                        clearAutoScrolls(),
                        cancelThrottle()
                },
                nulling: function () {
                    ;(touchEvt$1 =
                        scrollRootEl =
                        scrollEl =
                        scrolling =
                        pointerElemChangedInterval =
                        lastAutoScrollX =
                        lastAutoScrollY =
                            null),
                        (autoScrolls.length = 0)
                },
                _handleFallbackAutoScroll: function (evt) {
                    this._handleAutoScroll(evt, !0)
                },
                _handleAutoScroll: function (evt, fallback) {
                    var _this = this,
                        x = (evt.touches ? evt.touches[0] : evt).clientX,
                        y = (evt.touches ? evt.touches[0] : evt).clientY,
                        elem = document.elementFromPoint(x, y)
                    if (
                        ((touchEvt$1 = evt),
                        fallback ||
                            this.options.forceAutoScrollFallback ||
                            Edge ||
                            IE11OrLess ||
                            Safari)
                    ) {
                        autoScroll(evt, this.options, elem, fallback)
                        var ogElemScroller = getParentAutoScrollElement(
                            elem,
                            !0,
                        )
                        scrolling &&
                            (!pointerElemChangedInterval ||
                                x !== lastAutoScrollX ||
                                y !== lastAutoScrollY) &&
                            (pointerElemChangedInterval &&
                                clearPointerElemChangedInterval(),
                            (pointerElemChangedInterval = setInterval(
                                function () {
                                    var newElem = getParentAutoScrollElement(
                                        document.elementFromPoint(x, y),
                                        !0,
                                    )
                                    newElem !== ogElemScroller &&
                                        ((ogElemScroller = newElem),
                                        clearAutoScrolls()),
                                        autoScroll(
                                            evt,
                                            _this.options,
                                            newElem,
                                            fallback,
                                        )
                                },
                                10,
                            )),
                            (lastAutoScrollX = x),
                            (lastAutoScrollY = y))
                    } else {
                        if (
                            !this.options.bubbleScroll ||
                            getParentAutoScrollElement(elem, !0) ===
                                getWindowScrollingElement()
                        ) {
                            clearAutoScrolls()
                            return
                        }
                        autoScroll(
                            evt,
                            this.options,
                            getParentAutoScrollElement(elem, !1),
                            !1,
                        )
                    }
                },
            }),
            _extends(AutoScroll, {
                pluginName: 'scroll',
                initializeByDefault: !0,
            })
        )
    }
    function clearAutoScrolls() {
        autoScrolls.forEach(function (autoScroll2) {
            clearInterval(autoScroll2.pid)
        }),
            (autoScrolls = [])
    }
    function clearPointerElemChangedInterval() {
        clearInterval(pointerElemChangedInterval)
    }
    var autoScroll = throttle(function (evt, options, rootEl2, isFallback) {
            if (!!options.scroll) {
                var x = (evt.touches ? evt.touches[0] : evt).clientX,
                    y = (evt.touches ? evt.touches[0] : evt).clientY,
                    sens = options.scrollSensitivity,
                    speed = options.scrollSpeed,
                    winScroller = getWindowScrollingElement(),
                    scrollThisInstance = !1,
                    scrollCustomFn
                scrollRootEl !== rootEl2 &&
                    ((scrollRootEl = rootEl2),
                    clearAutoScrolls(),
                    (scrollEl = options.scroll),
                    (scrollCustomFn = options.scrollFn),
                    scrollEl === !0 &&
                        (scrollEl = getParentAutoScrollElement(rootEl2, !0)))
                var layersOut = 0,
                    currentParent = scrollEl
                do {
                    var el = currentParent,
                        rect = getRect(el),
                        top = rect.top,
                        bottom = rect.bottom,
                        left = rect.left,
                        right = rect.right,
                        width = rect.width,
                        height = rect.height,
                        canScrollX = void 0,
                        canScrollY = void 0,
                        scrollWidth = el.scrollWidth,
                        scrollHeight = el.scrollHeight,
                        elCSS = css(el),
                        scrollPosX = el.scrollLeft,
                        scrollPosY = el.scrollTop
                    el === winScroller
                        ? ((canScrollX =
                              width < scrollWidth &&
                              (elCSS.overflowX === 'auto' ||
                                  elCSS.overflowX === 'scroll' ||
                                  elCSS.overflowX === 'visible')),
                          (canScrollY =
                              height < scrollHeight &&
                              (elCSS.overflowY === 'auto' ||
                                  elCSS.overflowY === 'scroll' ||
                                  elCSS.overflowY === 'visible')))
                        : ((canScrollX =
                              width < scrollWidth &&
                              (elCSS.overflowX === 'auto' ||
                                  elCSS.overflowX === 'scroll')),
                          (canScrollY =
                              height < scrollHeight &&
                              (elCSS.overflowY === 'auto' ||
                                  elCSS.overflowY === 'scroll')))
                    var vx =
                            canScrollX &&
                            (Math.abs(right - x) <= sens &&
                                scrollPosX + width < scrollWidth) -
                                (Math.abs(left - x) <= sens && !!scrollPosX),
                        vy =
                            canScrollY &&
                            (Math.abs(bottom - y) <= sens &&
                                scrollPosY + height < scrollHeight) -
                                (Math.abs(top - y) <= sens && !!scrollPosY)
                    if (!autoScrolls[layersOut])
                        for (var i = 0; i <= layersOut; i++)
                            autoScrolls[i] || (autoScrolls[i] = {})
                    ;(autoScrolls[layersOut].vx != vx ||
                        autoScrolls[layersOut].vy != vy ||
                        autoScrolls[layersOut].el !== el) &&
                        ((autoScrolls[layersOut].el = el),
                        (autoScrolls[layersOut].vx = vx),
                        (autoScrolls[layersOut].vy = vy),
                        clearInterval(autoScrolls[layersOut].pid),
                        (vx != 0 || vy != 0) &&
                            ((scrollThisInstance = !0),
                            (autoScrolls[layersOut].pid = setInterval(
                                function () {
                                    isFallback &&
                                        this.layer === 0 &&
                                        Sortable.active._onTouchMove(touchEvt$1)
                                    var scrollOffsetY = autoScrolls[this.layer]
                                            .vy
                                            ? autoScrolls[this.layer].vy * speed
                                            : 0,
                                        scrollOffsetX = autoScrolls[this.layer]
                                            .vx
                                            ? autoScrolls[this.layer].vx * speed
                                            : 0
                                    ;(typeof scrollCustomFn == 'function' &&
                                        scrollCustomFn.call(
                                            Sortable.dragged.parentNode[
                                                expando
                                            ],
                                            scrollOffsetX,
                                            scrollOffsetY,
                                            evt,
                                            touchEvt$1,
                                            autoScrolls[this.layer].el,
                                        ) !== 'continue') ||
                                        scrollBy(
                                            autoScrolls[this.layer].el,
                                            scrollOffsetX,
                                            scrollOffsetY,
                                        )
                                }.bind({ layer: layersOut }),
                                24,
                            )))),
                        layersOut++
                } while (
                    options.bubbleScroll &&
                    currentParent !== winScroller &&
                    (currentParent = getParentAutoScrollElement(
                        currentParent,
                        !1,
                    ))
                )
                scrolling = scrollThisInstance
            }
        }, 30),
        drop = function (_ref) {
            var originalEvent = _ref.originalEvent,
                putSortable2 = _ref.putSortable,
                dragEl2 = _ref.dragEl,
                activeSortable = _ref.activeSortable,
                dispatchSortableEvent = _ref.dispatchSortableEvent,
                hideGhostForTarget = _ref.hideGhostForTarget,
                unhideGhostForTarget = _ref.unhideGhostForTarget
            if (!!originalEvent) {
                var toSortable = putSortable2 || activeSortable
                hideGhostForTarget()
                var touch =
                        originalEvent.changedTouches &&
                        originalEvent.changedTouches.length
                            ? originalEvent.changedTouches[0]
                            : originalEvent,
                    target = document.elementFromPoint(
                        touch.clientX,
                        touch.clientY,
                    )
                unhideGhostForTarget(),
                    toSortable &&
                        !toSortable.el.contains(target) &&
                        (dispatchSortableEvent('spill'),
                        this.onSpill({
                            dragEl: dragEl2,
                            putSortable: putSortable2,
                        }))
            }
        }
    function Revert() {}
    Revert.prototype = {
        startIndex: null,
        dragStart: function (_ref2) {
            var oldDraggableIndex2 = _ref2.oldDraggableIndex
            this.startIndex = oldDraggableIndex2
        },
        onSpill: function (_ref3) {
            var dragEl2 = _ref3.dragEl,
                putSortable2 = _ref3.putSortable
            this.sortable.captureAnimationState(),
                putSortable2 && putSortable2.captureAnimationState()
            var nextSibling = getChild(
                this.sortable.el,
                this.startIndex,
                this.options,
            )
            nextSibling
                ? this.sortable.el.insertBefore(dragEl2, nextSibling)
                : this.sortable.el.appendChild(dragEl2),
                this.sortable.animateAll(),
                putSortable2 && putSortable2.animateAll()
        },
        drop,
    }
    _extends(Revert, { pluginName: 'revertOnSpill' })
    function Remove() {}
    Remove.prototype = {
        onSpill: function (_ref4) {
            var dragEl2 = _ref4.dragEl,
                putSortable2 = _ref4.putSortable,
                parentSortable = putSortable2 || this.sortable
            parentSortable.captureAnimationState(),
                dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2),
                parentSortable.animateAll()
        },
        drop,
    }
    _extends(Remove, { pluginName: 'removeOnSpill' })
    Sortable.mount(new AutoScrollPlugin())
    Sortable.mount(Remove, Revert)
    var sortable_esm_default = Sortable
    window.Sortable = sortable_esm_default
    var sortable_default = (Alpine) => {
        Alpine.directive('sortable', (el) => {
            el.sortable = sortable_esm_default.create(el, {
                draggable: '[x-sortable-item]',
                handle: '[x-sortable-handle]',
                dataIdAttr: 'x-sortable-item',
            })
        })
    }
    document.addEventListener('alpine:init', () => {
        window.Alpine.plugin(module_default2),
            window.Alpine.plugin(sortable_default),
            window.Alpine.plugin(module_default)
    })
    var pluralize = function (text, number, variables) {
        function extract(segments2, number2) {
            for (let part of segments2) {
                let line = extractFromString(part, number2)
                if (line !== null) return line
            }
        }
        function extractFromString(part, number2) {
            let matches3 = part.match(/^[\{\[]([^\[\]\{\}]*)[\}\]](.*)/s)
            if (matches3 === null || matches3.length !== 3) return null
            let condition = matches3[1],
                value2 = matches3[2]
            if (condition.includes(',')) {
                let [from, to] = condition.split(',', 2)
                if (to === '*' && number2 >= from) return value2
                if (from === '*' && number2 <= to) return value2
                if (number2 >= from && number2 <= to) return value2
            }
            return condition == number2 ? value2 : null
        }
        function ucfirst(string) {
            return (
                string.toString().charAt(0).toUpperCase() +
                string.toString().slice(1)
            )
        }
        function replace(line, replace2) {
            if (replace2.length === 0) return line
            let shouldReplace = {}
            for (let [key, value2] of Object.entries(replace2))
                (shouldReplace[':' + ucfirst(key ?? '')] = ucfirst(
                    value2 ?? '',
                )),
                    (shouldReplace[':' + key.toUpperCase()] = value2
                        .toString()
                        .toUpperCase()),
                    (shouldReplace[':' + key] = value2)
            return (
                Object.entries(shouldReplace).forEach(([key, value2]) => {
                    line = line.replaceAll(key, value2)
                }),
                line
            )
        }
        function stripConditions(segments2) {
            return segments2.map((part) =>
                part.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ''),
            )
        }
        let segments = text.split('|'),
            value = extract(segments, number)
        return value != null
            ? replace(value.trim(), variables)
            : ((segments = stripConditions(segments)),
              replace(
                  segments.length > 1 && number > 1 ? segments[1] : segments[0],
                  variables,
              ))
    }
    window.pluralize = pluralize
})()
/*!
 * focus-trap 6.6.1
 * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
 */
/*!
 * tabbable 5.2.1
 * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
 */
/**!
 * Sortable 1.15.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
